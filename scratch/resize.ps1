Copy-Item "C:\Users\meetk\.gemini\antigravity-ide\brain\b15cd7a1-9640-47b2-b0e9-d145c28999d8\icon_512_1781259054901.png" "c:\Users\meetk\OneDrive\Desktop\jatka\public\icon-512.png" -Force

Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile("c:\Users\meetk\OneDrive\Desktop\jatka\public\icon-512.png")
$bmp = New-Object System.Drawing.Bitmap(192, 192)
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.DrawImage($src, 0, 0, 192, 192)
$bmp.Save("c:\Users\meetk\OneDrive\Desktop\jatka\public\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$bmp.Dispose()
$graph.Dispose()

Write-Output "Successfully resized!"
