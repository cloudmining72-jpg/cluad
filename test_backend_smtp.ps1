$body = @{
    email = "ijaz@test.com"
    fullName = "Test User"
} | ConvertTo-Json

Write-Host "Testing Local Node Backend SMTP..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/send-signup-otp" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body
    Write-Host "STATUS CODE: $($response.StatusCode)"
    Write-Host "RESPONSE: $($response.Content)"
} catch {
    Write-Host "STATUS: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "RESPONSE: $($reader.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}
