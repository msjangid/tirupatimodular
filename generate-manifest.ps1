$output = @{}
$categories = @("Bedroom", "Drawingroom", "Kitchen")

foreach ($cat in $categories) {
    $path = ".\main\$cat"
    $images = @()
    
    if (Test-Path $path) {
        $files = Get-ChildItem -Path $path -Filter "*.jpg" | Sort-Object Name
        foreach ($file in $files) {
            $images += "main/$cat/$($file.Name)"
        }
    }
    
    $output[$cat] = $images
    Write-Host "$cat : $($images.Count) images"
}

$json = ConvertTo-Json -InputObject $output -Depth 100
$json | Out-File -FilePath "images-manifest.json" -Encoding UTF8 -Force

Write-Host "`n✓ Manifest generated successfully!"

