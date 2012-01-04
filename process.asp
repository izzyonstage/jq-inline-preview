<%@ language = VBScript
	enableSessionState = true
	transaction = not_supported
	codepage = 65001
	LCID = 2057
%>
<%
	option explicit
	
	response.clear
	response.buffer = true
	response.charset = "UTF-8"
	response.codePage = 65001
	response.expiresAbsolute = #2000-01-01#
	response.LCID = 2057
	
	dim strAssetPath : strAssetPath = server.mapPath("images/" & request.queryString("src"))
	dim strOutputFileName : strOutputFileName = request.queryString("filename")

	call streamFile( strAssetPath, strOutputFileName)


function streamFile(byval strAssetPath, byval strOutputFileName)
	dim arrExtension : arrExtension = split(strAssetPath, ".")
	dim strExtension : strExtension = arrExtension(ubound(arrExtension))

 	call response.addHeader("content-disposition", "attachment; filename=" & strOutputFileName)

  	select case strExtension
  		case "jpg", "jpeg" : response.contentType = "image/jpeg"
  		case "pdf" : response.contentType = "application/pdf"
  		case "png" : response.contentType = "image/png"
  		case else : response.contentType = "unknown/unknown"
  	end select

	dim lngBytes
	dim objStream : set objStream = server.CreateObject("ADODB.Stream")
 	'objStream.mode = 1     '// adModeRead
 	objStream.type = 1     '// adModeBinary
	objStream.open
	call objStream.LoadFromFile(strAssetPath)
 	call response.addHeader("Content-Length", objStream.size)

 	dim ii : for ii = 0 to objStream.Size
 		lngBytes = objStream.read(2048)
 		response.binaryWrite(lngBytes)
 		response.flush
 	next

	set objStream = nothing : objStream = empty
end function
%>
