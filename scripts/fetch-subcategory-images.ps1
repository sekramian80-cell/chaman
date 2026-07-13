# دانلود عکس آزاد از Wikimedia Commons برای هر زیردسته (با backoff)
$ErrorActionPreference = "Stop"
$ua = "FarazChamanBot/1.0 (https://farazchaman.ir; admin@farazchaman.ir)"
$outDir = Join-Path $PSScriptRoot "..\src\assets\subcategories"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Invoke-WithRetry([string]$Uri, [string]$OutFile) {
    $delays = @(0, 4, 10, 20, 40)
    foreach ($d in $delays) {
        if ($d -gt 0) { Start-Sleep -Seconds $d }
        try {
            if ($OutFile) {
                Invoke-WebRequest -Uri $Uri -Headers @{ "User-Agent" = $ua } -OutFile $OutFile -TimeoutSec 45 -UseBasicParsing
                return $true
            }
            else {
                return (Invoke-WebRequest -Uri $Uri -Headers @{ "User-Agent" = $ua } -TimeoutSec 30 -UseBasicParsing)
            }
        }
        catch {
            $msg = $_.Exception.Message
            if ($msg -notmatch "429|Too many|Too Many") { throw }
        }
    }
    throw "rate limited after retries"
}

$map = [ordered]@{
    "football"        = "artificial turf football field"
    "club"            = "artificial turf sports court"
    "padel"           = "padel court"
    "golf"            = "artificial putting green golf"
    "tennis"          = "artificial grass tennis court"
    "paintball"       = "paintball field outdoor"
    "futsal"          = "futsal court artificial turf"
    "school"          = "school playground lawn"
    "hockey"          = "field hockey artificial turf"
    "restaurant"      = "restaurant outdoor terrace garden"
    "rooftop"         = "rooftop terrace city"
    "terrace-balcony" = "balcony artificial grass"
    "kindergarten"    = "playground children park"
    "garden"          = "green lawn garden"
    "patio"           = "patio backyard garden"
    "hall"            = "wedding venue garden"
    "yard"            = "backyard artificial grass lawn"
    "workplace"       = "office green wall plants"
    "villa"           = "villa garden lawn"
    "tile-grass"      = "artificial turf close up"
    "wall-grass"      = "green wall plants building"
    "moketi"          = "green carpet grass texture"
    "grass-fence"     = "artificial hedge fence"
}

$results = @()

foreach ($slug in $map.Keys) {
    $dest = Join-Path $outDir "$slug.jpg"
    if (Test-Path $dest) {
        $results += "HAVE  $slug"
        continue
    }
    $term = $map[$slug]
    $enc = [uri]::EscapeDataString($term)
    $api = "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrnamespace=6&gsrlimit=6&gsrsearch=$enc&iiprop=url|mime&iiurlwidth=900"
    try {
        $resp = Invoke-WithRetry $api $null
        $data = $resp.Content | ConvertFrom-Json
        $pages = $data.query.pages
        $thumb = $null
        if ($pages) {
            foreach ($p in $pages.PSObject.Properties.Value | Sort-Object index) {
                $info = $p.imageinfo[0]
                if ($info -and $info.thumburl -and ($info.mime -match "jpeg|png")) {
                    $thumb = $info.thumburl
                    break
                }
            }
        }
        if (-not $thumb) {
            $results += "SKIP  $slug (no result)"
            Start-Sleep -Seconds 3
            continue
        }
        Start-Sleep -Seconds 3
        [void](Invoke-WithRetry $thumb $dest)
        $len = (Get-Item $dest).Length
        $results += "OK    $slug ($([math]::Round($len/1kb)) KB)"
    }
    catch {
        $results += "FAIL  $slug :: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds 3
}

$results | ForEach-Object { Write-Output $_ }
