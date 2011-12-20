<%@ Language="VBScript" %>
<%
Option Explicit

dim startTime: startTime = Timer()
dim endTime: endTime = Timer()

dim waitTime: waitTime = endTime - startTime

do while waitTime < 3
	endTime = Timer()
	waitTime = endTime - startTime
loop

dim tabID: tabID = Request.QueryString("tab")

if tabID = 4 then
	call err.raise(1, "Forced Error")
end if

dim extraJSON: extraJSON = ""
if tabID = 5 then
	extraJSON = ", ""ErrorCode"": ""ERROR_CORRUPTPROJECT"""
end if

dim status: status = "Preview"
select case tabID
	case 5: status = "Warning"
end select

dim imagePath: imagePath = "images/example.jpg"
select case tabID
	case 2: imagePath = "images/example-wide.jpg"
	case 3: imagePath = ""
end select

dim linkPath: linkPath = "files/example.pdf"
select case tabID
	case 3: linkPath = ""
end select

Response.Clear()
Response.Write("{""Status"": """ & status & """, ""PreviewImage"": """ & imagePath & """, ""PreviewLink"": """ & linkPath & """, ""TabId"": """ & Request.QueryString("tab") & """, ""PreviewRequestGUID"": """ & Request.QueryString("previewRequestGUID") & """" & extraJSON & "}")
Response.End()
%>