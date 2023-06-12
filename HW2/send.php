<?php
  $to =$_POST['email']; //收件者
  $subject = "訂單確認信"; //信件標題
  $headers = "From: zzlu@class"; //寄件者
  
  $name =$_POST['name'];
  $phone =$_POST['phone'];
  $county =$_POST['county'];
  $address =$_POST['address'];
  $project =$_POST['project'];
  $mailBoundary = md5(time());
  
  
require_once('../TCPDF/tcpdf_import.php');

$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->SetFont('cid0jp','', 18); 
$pdf->AddPage();

$html = <<<EOF
<head>  
		<meta charset = "utf-8"<title></title>
		<style type = "text/css">
		  p{font-size:20;}
		  table,th,td{border:1px solid black;}
		  table {width : 360px; height: 175px;
		  margin:50px;}
		  </style>
		</head>
	<body>
	<p style="text-align:center;">匯款單</p>
	<table id="table">
	<tr>
	  <td>姓名:</td>
		<td>$name</td>
	  <td>電話:</td>
	  <td>$phone</td>
	</tr>
	<tr>
	  <td>配送縣市:</td>
	  <td colspan="3" style = "color:blue">$county</td>
	</tr>
	<tr>
	  <td>地址:</td>
	  <td colspan="3" style = "color:blue">$address</td>
	</tr>
	<tr>
	  <td>贊助專案:</td>
	  <td colspan="3">$project</td>
	</tr>
	</table>
	</body>
EOF;

include('../phpqrcode/qrlib.php');
include('../phpqrcode/qrconfig.php');
    
$tempDir = '/home/s1111427/public_html/HW2/qrcode/';

$codeContents = 'http://140.138.77.70/~s1111427/HW2/mail/'.$name.'.pdf';

$fileName = $name.'.png';

$pngAbsoluteFilePath = $tempDir.$fileName;
$urlRelativeFilePath = EXAMPLE_TMP_URLRELPATH.$fileName;

QRcode::png($codeContents,$pngAbsoluteFilePath);

  
  $pdf->writeHTML($html);
  $pdf->lastPage();
  ob_end_clean();
  $pdf->Output('/home/s1111427/public_html/HW2/mail/'.$name.'.pdf', 'FI');


  $mailAttach = '/home/s1111427/public_html/HW2/qrcode/'.$name.'.png';
  
  $msg = "
感謝您的贊助。<br>
姓名:$name<br>
連絡電話:$phone<br>
配送地址:$address<br>
贊助方案:$project
";


$mailHead = implode("\r\n", [
  "MIME-Version: 1.0",
  "Content-Type: multipart/mixed; boundary=\"$mailBoundary\""
]);

// (C) DEFINE THE EMAIL MESSAGE
$mailBody = implode("\r\n", [
  "--$mailBoundary",
  "Content-type: text/html; charset=utf-8",
  "",
  $msg
]);

// (D) MANUALLY ENCODE & ATTACH THE FILE
$mailBody .= implode("\r\n", [
  "",
  "--$mailBoundary",
  "Content-Type: application/octet-stream; name=\"". basename($mailAttach) . "\"",
  "Content-Transfer-Encoding: base64",
  "Content-Disposition: attachment",
  "",
  chunk_split(base64_encode(file_get_contents($mailAttach))),
  "--$mailBoundary--"
]);

// (E) SEND
echo mail($to, $subject, $mailBody, $mailHead)
  ? "OK" : "ERROR" ;


?>