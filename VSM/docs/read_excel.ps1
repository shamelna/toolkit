$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$path = (Resolve-Path "VSM_Calculations_Learning_to_See.xlsx").Path
Write-Host "Opening: $path"

$workbook = $excel.Workbooks.Open($path)
$worksheet = $workbook.Worksheets.Item(1)
Write-Host "Worksheet name: $($worksheet.Name)"
Write-Host "Total worksheets: $($workbook.Worksheets.Count)"

for ($ws = 1; $ws -le $workbook.Worksheets.Count; $ws++) {
    $worksheet = $workbook.Worksheets.Item($ws)
    Write-Host "`n=== Worksheet $($ws): $($worksheet.Name) ==="
    
    for ($i = 1; $i -le 25; $i++) {
    $row = ""
    for ($j = 1; $j -le 8; $j++) {
        $cell = $worksheet.Cells.Item($i, $j)
        $value = if ($cell.Value2) { $cell.Value2 } else { "" }
        $row += "$value | "
    }
    Write-Host "Row ${i}: ${row}"
}

$workbook.Close($false)
$excel.Quit()
