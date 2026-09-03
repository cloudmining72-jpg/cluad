$body = @{
    service_id = "service_abbiw6c"
    template_id = "template_z8w72rc"
    user_id = "WgBGiv4o--z8vCAl3"
    template_params = @{
        to_email = "ijaz@test.com"
        to_name = "Ijaz Test"
        otp_code = "847291"
        app_name = "ClaudeMining"
    }
} | ConvertTo-Json -Depth 5

Write-Host "Testing EmailJS from localhost origin..."
try {
    $response = Invoke-WebRequest -Uri "https://api.emailjs.com/api/v1.0/email/send" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"; "origin"="http://localhost:5173"} `
        -Body $body
    Write-Host "STATUS CODE: $($response.StatusCode)"
} catch {
    Write-Host "STATUS: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "RESPONSE: $($reader.ReadToEnd())"
    }
}
