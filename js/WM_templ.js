/*
		templs  - шаблоны каркасов оформления блоков 
		
*/
	var templs = {};
	templs = {

// шаблон оформления показа просто нормального изображения 
		image_size_n: ''
			+'<img templ="" '
			+' src="#image_n#" '
			+' class="#class#" '
			+' id="#id#" '
			+' label="#label#" '
			+' data_id="#data_id#" '
			+' title="#title#" '
			+' size_s="#image_s#" '
			+' size="#image#" '
			+' type="#type#" >',

// шаблон оформления показа изображения / <figure>
		image2figure: '<figure templ="image2figure" '
			+' class="#type# #class#" '
			+' data_id="#data_id#" '
			+' label="#label#" '			
			+' title="#title#" '
	//		+' title="#anons#" '
			+' type="#type#" >'
			+'<img src="#image_s#" '
			+' id="#id#" '
			+' size_f="#image#" '
			+' size_n="#image_n#" '
			+' >'
			+' <figcaption > '
			+' #caption# '	// здесь запись "родства"		
		//	+' #title# '
			+'</figcaption>'		
			+'</figure>',


// шаблон оформления показа коллекции / <figure>
		collection2figure: '<figure templ="collection2figure" '
			+' class=\"#type# #class#\" '
			+' id="#id#" '
			+' data_id="#data_id#" '
			+' label="#label#" '			
			+' title="#title#" '
			+' type="#type#" '
			+' >'
			+'<img src="#image_s#" '
		//	+' class="#class#" '
			+' size_f="#image#" '
			+' size_n="#image_n#" '
			+' >'
			+' <figcaption > '
			+' #title# '
			+'</figcaption>'		
			+'</figure>',


// шаблон оформления изображений текущего каталога
			Tema2katalog_pict: '<a templ="Tema2katalog_pict" '
			+' id="pict_#id#" class="cont pict ui-draggable" '
			+' path="#pict_path#/#pict_size_n#" kod_group="#pict_kod_old#" '
			+' id_pict="#id_pict#" '
			+' group=0 id_group="#pict_id_old#"  '
			+'type="#type#" name="#pict_msg_1#" id_pp="#id#" id_pict =#id_pict# '
			+' title=" '
			+' name =#pict_msg_1#\n '
			+' id_pict = #id_pict#\n '
			+' grupa = #grupa#\n '
			+' pict_id_old = #pict_id_old#\n '
			+' pict_kod_old = #pict_kod_old#\n '
			+' rel_order = #rel_order#\n '
			+' size_s = #pict_size_s#\n '
			+' size_m = #pict_size_m#\n '
			+' size_n = #pict_size_n#\n '
			+' size_g = #pict_size_g#\n '
			+' pict_msg_1 = #pict_msg_1#\n '
			+' pict_msg_2 = #pict_msg_2#\n '
			+' pict_msg_3 = #pict_msg_3#\n '
			+' type = #type# " >'
			+' <span class="first"></span>'
			+' <img src="#pict_path#/#pict_size_s#" >'
			+' <span class="name">#pict_msg_1#</span>'
			+' <span class="last"></span></a>',	

// шаблон оформления показа изображения / в галлереи
			Show_pict: '<img templ="Show_pict" '
			+' src="#pict_path#/#pict_size_n#" class="show_pict" '
			+' kod_group="#pict_kod_old#" id_group="#pict_id_old#" id_group="#pict_id_old#"  '
			+' type="#type#" name="#pict_msg_1#" id_pp="#id#" id_pict = #id_pict# '
			+' title=" '
			+' msg_1 =#pict_msg_1#\n '
			+' msg_2 =#pict_msg_2#\n '
			+' msg_3 =#pict_msg_3#\n '
			+' id_pict = #id_pict#\n '
			+' grupa = #grupa#\n '
			+' pict_id_old = #pict_id_old#\n '
			+' pict_kod_old = #pict_kod_old#\n '
			+' rel_order = #rel_order#\n '
			+' size_s = #pict_size_s#\n '
			+' size_m = #pict_size_m#\n '
			+' size_n = #pict_size_n#\n '
			+' size_g = #pict_size_g#\n '
			+' type = #type# " >',
		/*	+'<span id="pict_msg_1">#pict_msg_1#</span>', /* */


// шаблон оформления перехода на дополнительную информации о персоне
			open_add_info: '<div templ="open_add_info" '
			+' class="#group# anons_add" >'
			+' <a class="open_add_info" '
			+' name = "#label#" '
			+' group = "#group#" '
			+' file = "#file#" '
			+' type = "#type#" >'
			+' <span class="name">#title#</span><br>'
			+' <span class="source">Источник: #source_title#</span>'
			+' </a>'
			+' </<div>',
			
// шаблон оформления показа текста pdf
			out_pdf: '<object data="#file#" /></object>'
			+'',
			
// шаблон оформления показа текста video youtube
			out_youtube: '<iframe width="800px" height="500px"'
			+' src="#source#" '
			+' frameborder="0" allowfullscreen>'
			+'</iframe>',

// шаблон оформления показа текста video rutube
			out_rutube: '<iframe width="853" height="480"'
			+' src="#source#" '
			+' frameBorder="0" allow="clipboard-write; " ' // autoplay
			+'  encrypted-media; fullscreen; picture-in-picture;"  '  //allow="autoplay;
 			+' frameborder="0" allowfullscreen >'
			+'</iframe>',

// шаблон оформления показа текста video VK
			out_VK: '<iframe width="800" height="500"'
			+' src="#source#" '
			+' frameBorder="0" allow="clipboard-write;" '  // autoplay
			+' webkitAllowFullScreen mozallowfullscreen allowFullScreen>'
			+'</iframe>',

			
			
 /*

// шаблон оформления 

// шаблон оформления 			
			
*/			
	}