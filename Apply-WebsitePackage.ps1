param(
    [Parameter(Mandatory = $true)]
    [string]$PackagePath,

    [Parameter(Mandatory = $false)]
    [string]$OutputDir = "",

    [Parameter(Mandatory = $false)]
    [string]$SourceDir = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-HtmlEncodedText {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    return [System.Net.WebUtility]::HtmlEncode($Text)
}

function Set-ElementTextByDataAttribute {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Html,

        [Parameter(Mandatory = $true)]
        [string]$AttributeName,

        [Parameter(Mandatory = $true)]
        [string]$AttributeValue,

        [Parameter(Mandatory = $true)]
        [string]$ReplacementText
    )

    $pattern = '(?is)(<' +
        '(?<tag>[a-z0-9]+)\b[^>]*' +
        [regex]::Escape($AttributeName) +
        '="' +
        [regex]::Escape($AttributeValue) +
        '"[^>]*>)(?<content>.*?)(</\k<tag>>)'

    return [regex]::Replace(
        $Html,
        $pattern,
        {
            param($match)
            $openingTag = $match.Groups[1].Value
            $closingTag = $match.Groups[4].Value
            $safeText = Get-HtmlEncodedText -Text $ReplacementText
            return $openingTag + $safeText + $closingTag
        },
        1
    )
}

function Set-ElementTextById {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Html,

        [Parameter(Mandatory = $true)]
        [string]$IdValue,

        [Parameter(Mandatory = $true)]
        [string]$ReplacementText
    )

    return Set-ElementTextByDataAttribute -Html $Html -AttributeName "id" -AttributeValue $IdValue -ReplacementText $ReplacementText
}

function Set-CategoryTitles {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Html,

        [Parameter(Mandatory = $true)]
        [hashtable]$CategoryTitles
    )

    $updatedHtml = $Html
    foreach ($key in $CategoryTitles.Keys) {
        $updatedHtml = Set-ElementTextByDataAttribute -Html $updatedHtml -AttributeName "data-category-title" -AttributeValue ([string]$key) -ReplacementText ([string]$CategoryTitles[$key])
    }

    return $updatedHtml
}

function Set-SectionVisibility {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Html,

        [Parameter(Mandatory = $true)]
        [hashtable]$HiddenSections
    )

    $updatedHtml = $Html
    foreach ($sectionName in $HiddenSections.Keys) {
        if (-not [bool]$HiddenSections[$sectionName]) {
            continue
        }

        $pattern = '(?is)(<section\b[^>]*data-section="' + [regex]::Escape([string]$sectionName) + '"[^>]*)(>)'
        $updatedHtml = [regex]::Replace(
            $updatedHtml,
            $pattern,
            {
                param($match)
                $tagPrefix = $match.Groups[1].Value
                if ($tagPrefix -match 'data-section-hidden=') {
                    return $match.Value
                }
                return $tagPrefix + ' data-section-hidden="true"' + $match.Groups[2].Value
            },
            1
        )
    }

    return $updatedHtml
}

function Set-SectionOrder {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Html,

        [Parameter(Mandatory = $true)]
        [string[]]$SectionOrder
    )

    if ($SectionOrder.Count -eq 0) {
        return $Html
    }

    $mainMatch = [regex]::Match($Html, '(?is)(<main\b[^>]*>)(?<inner>.*?)(</main>)')
    if (-not $mainMatch.Success) {
        return $Html
    }

    $mainInner = $mainMatch.Groups["inner"].Value
    $sectionMatches = [regex]::Matches($mainInner, '(?is)<section\b[^>]*data-section="(?<name>[^"]+)"[^>]*>.*?</section>')
    if ($sectionMatches.Count -eq 0) {
        return $Html
    }

    $sectionBlocks = @{}
    foreach ($sectionMatch in $sectionMatches) {
        $sectionBlocks[$sectionMatch.Groups["name"].Value] = $sectionMatch.Value
    }

    $orderedBlocks = New-Object System.Collections.Generic.List[string]
    foreach ($sectionName in $SectionOrder) {
        if ($sectionBlocks.ContainsKey($sectionName)) {
            $orderedBlocks.Add($sectionBlocks[$sectionName])
        }
    }

    if ($orderedBlocks.Count -ne $sectionBlocks.Count) {
        return $Html
    }

    $replacement = $mainMatch.Groups[1].Value + "`r`n" + (($orderedBlocks -join "`r`n`r`n")) + "`r`n" + $mainMatch.Groups[3].Value
    return $Html.Substring(0, $mainMatch.Index) + $replacement + $Html.Substring($mainMatch.Index + $mainMatch.Length)
}

function Set-SortOrders {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Html,

        [Parameter(Mandatory = $true)]
        [string]$PageKey,

        [Parameter(Mandatory = $true)]
        [hashtable]$SortOrders
    )

    $containerPattern = '(?is)(<(?<tag>div|section)\b[^>]*class="[^"]*\b(?:category-grid|product-grid|bundle-grid|feature-grid|faq-grid|dashboard-grid|auth-grid)\b[^"]*"[^>]*>)(?<inner>.*?)(</\k<tag>>)'
    $matches = [regex]::Matches($Html, $containerPattern)
    if ($matches.Count -eq 0) {
        return $Html
    }

    $updatedHtml = $Html
    for ($index = $matches.Count - 1; $index -ge 0; $index--) {
        $match = $matches[$index]
        $groupId = "{0}-group-{1}" -f $PageKey, $index
        if (-not $SortOrders.ContainsKey($groupId)) {
            continue
        }

        $containerInner = $match.Groups["inner"].Value
        $itemMatches = [regex]::Matches($containerInner, '(?is)(\s*<(?:article|div|form)\b[^>]*>.*?</(?:article|div|form)>)')
        if ($itemMatches.Count -eq 0) {
            continue
        }

        $itemMap = @{}
        for ($childIndex = 0; $childIndex -lt $itemMatches.Count; $childIndex++) {
            $sortId = "{0}-item-{1}" -f $groupId, $childIndex
            $itemMap[$sortId] = $itemMatches[$childIndex].Groups[1].Value
        }

        $orderedItems = New-Object System.Collections.Generic.List[string]
        foreach ($sortId in $SortOrders[$groupId]) {
            if ($itemMap.ContainsKey([string]$sortId)) {
                $orderedItems.Add($itemMap[[string]$sortId])
            }
        }

        if ($orderedItems.Count -ne $itemMap.Count) {
            continue
        }

        $replacement = $match.Groups[1].Value + ($orderedItems -join "") + $match.Groups[4].Value
        $updatedHtml =
            $updatedHtml.Substring(0, $match.Index) +
            $replacement +
            $updatedHtml.Substring($match.Index + $match.Length)
    }

    return $updatedHtml
}

function Add-StyleOverrides {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Html,

        [Parameter(Mandatory = $true)]
        [hashtable]$RootVariables
    )

    if ($RootVariables.Count -eq 0) {
        return $Html
    }

    $declarations = New-Object System.Collections.Generic.List[string]
    foreach ($key in $RootVariables.Keys) {
        $declarations.Add("  {0}: {1};" -f $key, $RootVariables[$key])
    }

    $styleBlock = "<style>`r`n:root {`r`n{0}`r`n}`r`n</style>`r`n" -f ($declarations -join "`r`n")
    $headClose = [regex]::Match($Html, '(?is)</head>')
    if (-not $headClose.Success) {
        return $Html
    }

    return $Html.Substring(0, $headClose.Index) + $styleBlock + $Html.Substring($headClose.Index)
}

function Get-RootVariableOverrides {
    param(
        [Parameter(Mandatory = $true)]
        [pscustomobject]$Package
    )

    $variables = @{}

    $themeMap = @{
        luxury = @{
            "--bg" = "#0a0a0a"
            "--bg-soft" = "#151515"
            "--panel" = "rgba(17, 17, 17, 0.82)"
            "--panel-strong" = "#121212"
            "--text" = "#f8f2dc"
            "--muted" = "#c4b384"
            "--line" = "rgba(212, 175, 55, 0.2)"
            "--gold" = "#d4af37"
            "--gold-soft" = "#f2d782"
            "--cream" = "#fbf3df"
        }
        light = @{
            "--bg" = "#f5efe3"
            "--bg-soft" = "#ece2d1"
            "--panel" = "rgba(255, 251, 244, 0.92)"
            "--panel-strong" = "#fffaf2"
            "--text" = "#1d140f"
            "--muted" = "#6b584c"
            "--line" = "rgba(133, 95, 47, 0.18)"
            "--gold" = "#b8891e"
            "--gold-soft" = "#9a6e15"
            "--cream" = "#241913"
        }
        soft = @{
            "--bg" = "#161214"
            "--bg-soft" = "#211b1f"
            "--panel" = "rgba(28, 22, 26, 0.86)"
            "--panel-strong" = "#221a1f"
            "--text" = "#f7ecdf"
            "--muted" = "#cab3a0"
            "--line" = "rgba(201, 166, 130, 0.18)"
            "--gold" = "#c6925b"
            "--gold-soft" = "#efc08f"
            "--cream" = "#fff1e3"
        }
    }

    $accentMap = @{
        gold = @{
            "--gold" = "#d4af37"
            "--gold-soft" = "#f2d782"
            "--button-primary-bg" = "linear-gradient(135deg, #b8891e 0%, #f2d782 100%)"
            "--button-primary-text" = "#141414"
        }
        emerald = @{
            "--gold" = "#2f8f6f"
            "--gold-soft" = "#7de0c0"
            "--button-primary-bg" = "linear-gradient(135deg, #1d6b54 0%, #7de0c0 100%)"
            "--button-primary-text" = "#081510"
        }
        rose = @{
            "--gold" = "#b56a79"
            "--gold-soft" = "#f3b7c1"
            "--button-primary-bg" = "linear-gradient(135deg, #8f4757 0%, #f3b7c1 100%)"
            "--button-primary-text" = "#180a0f"
        }
        blue = @{
            "--gold" = "#3e78c9"
            "--gold-soft" = "#9bc6ff"
            "--button-primary-bg" = "linear-gradient(135deg, #28579e 0%, #9bc6ff 100%)"
            "--button-primary-text" = "#09111f"
        }
    }

    $densityMap = @{
        airy = "104px"
        balanced = "88px"
        compact = "64px"
    }

    $shapeMap = @{
        pill = "999px"
        rounded = "18px"
        square = "8px"
    }

    if ($Package.state.theme -and $themeMap.ContainsKey([string]$Package.state.theme)) {
        foreach ($key in $themeMap[[string]$Package.state.theme].Keys) {
            $variables[$key] = $themeMap[[string]$Package.state.theme][$key]
        }
    }

    if ($Package.state.accent -and $accentMap.ContainsKey([string]$Package.state.accent)) {
        foreach ($key in $accentMap[[string]$Package.state.accent].Keys) {
            $variables[$key] = $accentMap[[string]$Package.state.accent][$key]
        }
    }

    if ($Package.state.density -and $densityMap.ContainsKey([string]$Package.state.density)) {
        $variables["--section-gap"] = $densityMap[[string]$Package.state.density]
    }

    if ($Package.state.buttonShape -and $shapeMap.ContainsKey([string]$Package.state.buttonShape)) {
        $variables["--button-radius"] = $shapeMap[[string]$Package.state.buttonShape]
    }

    return $variables
}

function Convert-PageKeyToFileName {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FileName
    )

    $nameMap = @{
        "index.html" = "home"
        "shop.html" = "shop"
        "category-wedding.html" = "category"
        "bundles.html" = "bundles"
        "free-resources.html" = "freebies"
        "about.html" = "about"
        "faq.html" = "faq"
        "contact.html" = "contact"
        "login.html" = "login"
        "dashboard.html" = "dashboard"
    }

    if ($nameMap.ContainsKey($FileName)) {
        return $nameMap[$FileName]
    }

    return [System.IO.Path]::GetFileNameWithoutExtension($FileName)
}

if (-not (Test-Path -LiteralPath $PackagePath)) {
    throw "Package file not found: $PackagePath"
}

$resolvedPackagePath = (Resolve-Path -LiteralPath $PackagePath).Path
$packageJson = Get-Content -LiteralPath $resolvedPackagePath -Raw
$package = $packageJson | ConvertFrom-Json -Depth 100

if (-not $OutputDir) {
    $packageDirectory = Split-Path -Parent $resolvedPackagePath
    $OutputDir = Join-Path $packageDirectory "exported-site"
}

if (-not $SourceDir) {
    $SourceDir = Split-Path -Parent $resolvedPackagePath
}

if (-not (Test-Path -LiteralPath $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$rootOverrides = Get-RootVariableOverrides -Package $package

foreach ($page in $package.pages) {
    $pageHtml = [string]$page.source
    $pageKeyFromFile = Convert-PageKeyToFileName -FileName ([string]$page.file)
    $pageState = $package.state.pages.$pageKeyFromFile

    if ($package.state.brandName) {
        $pageHtml = Set-ElementTextById -Html $pageHtml -IdValue "brand-eyebrow" -ReplacementText ([string]$package.state.brandName)
    }

    if ($package.state.primaryCta) {
        $pageHtml = Set-ElementTextById -Html $pageHtml -IdValue "primary-cta" -ReplacementText ([string]$package.state.primaryCta)
    }

    if ($pageState) {
        if ($pageState.content) {
            foreach ($property in $pageState.content.PSObject.Properties) {
                $pageHtml = Set-ElementTextByDataAttribute -Html $pageHtml -AttributeName "data-edit-id" -AttributeValue $property.Name -ReplacementText ([string]$property.Value)
            }
        }

        if ($pageState.categoryTitles) {
            $categoryTitleTable = @{}
            foreach ($property in $pageState.categoryTitles.PSObject.Properties) {
                $categoryTitleTable[$property.Name] = [string]$property.Value
            }
            $pageHtml = Set-CategoryTitles -Html $pageHtml -CategoryTitles $categoryTitleTable
        }

        if ($pageState.hiddenSections) {
            $hiddenSectionTable = @{}
            foreach ($property in $pageState.hiddenSections.PSObject.Properties) {
                $hiddenSectionTable[$property.Name] = [bool]$property.Value
            }
            $pageHtml = Set-SectionVisibility -Html $pageHtml -HiddenSections $hiddenSectionTable
        }

        if ($pageState.sectionOrder) {
            $orderedNames = @()
            foreach ($item in $pageState.sectionOrder) {
                $orderedNames += [string]$item
            }
            $pageHtml = Set-SectionOrder -Html $pageHtml -SectionOrder $orderedNames
        }

        if ($pageState.sortOrders) {
            $sortOrderTable = @{}
            foreach ($property in $pageState.sortOrders.PSObject.Properties) {
                $sortIds = @()
                foreach ($sortId in $property.Value) {
                    $sortIds += [string]$sortId
                }
                $sortOrderTable[$property.Name] = $sortIds
            }
            $pageHtml = Set-SortOrders -Html $pageHtml -PageKey $pageKeyFromFile -SortOrders $sortOrderTable
        }
    }

    $pageHtml = Add-StyleOverrides -Html $pageHtml -RootVariables $rootOverrides
    $targetPath = Join-Path $OutputDir ([string]$page.file)
    Set-Content -LiteralPath $targetPath -Value $pageHtml -Encoding UTF8
}

$stateOutputPath = Join-Path $OutputDir "the-digital-atlas-state.json"
($package.state | ConvertTo-Json -Depth 100) | Set-Content -LiteralPath $stateOutputPath -Encoding UTF8

$assetFiles = @(
    "styles.css",
    "app.js",
    "the-digital-atlas-logo.svg",
    "the-digital-atlas-logo-black-gold.svg"
)

foreach ($assetFile in $assetFiles) {
    $sourceAssetPath = Join-Path $SourceDir $assetFile
    if (Test-Path -LiteralPath $sourceAssetPath) {
        Copy-Item -LiteralPath $sourceAssetPath -Destination (Join-Path $OutputDir $assetFile) -Force
    }
}

Write-Host ("Exported edited website files to: {0}" -f $OutputDir)
