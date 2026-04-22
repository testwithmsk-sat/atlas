Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$pages = @(
    "index.html",
    "shop.html"
)

$statePages = [ordered]@{}
$statePages.home = [ordered]@{
    content = [ordered]@{
        "hero-title" = "Beautiful digital storefront for templates, planners, and printables."
        "hero-text" = "A polished website ready to sell products now and grow product by product over time."
    }
    categoryTitles = [ordered]@{
        "1" = "Wedding Printables"
        "2" = "Business Kits"
    }
    hiddenSections = [ordered]@{
        "trust" = $true
    }
    sectionOrder = @("hero", "categories", "preview", "bundles", "freebies", "benefits", "faq", "trust")
}

$statePages.shop = [ordered]@{
    content = [ordered]@{
        "shop-hero-title" = "Shop digital products one collection at a time."
        "shop-card-1-title" = "Launch Product Slot"
    }
}

$package = [ordered]@{
    exportedAt = (Get-Date).ToString("o")
    currentPage = "home"
    state = [ordered]@{
        theme = "light"
        accent = "blue"
        density = "balanced"
        buttonShape = "rounded"
        brandName = "The Digital Atlas"
        primaryCta = "Browse Templates"
        pages = $statePages
    }
    pages = @()
}

foreach ($page in $pages) {
    $source = Get-Content -Raw -LiteralPath $page
    $titleMatch = [regex]::Match($source, "<title>([^<]+)</title>", "IgnoreCase")
    $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { $page }

    $package.pages += [ordered]@{
        file = $page
        title = $title
        source = $source
    }
}

$package | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath ".\\the-digital-atlas-project-package.json" -Encoding UTF8
