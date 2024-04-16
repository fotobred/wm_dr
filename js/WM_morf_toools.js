/*
		toools  v_05
		
*/

const test_out = 'Y' ; // 'N' - нет тестового вывода в console
var gcc = 0; // "глобальный" счетчик

function gc() {
	gcc++;
	if( gc > 50020 ){		//  защита от "зацикливания"
		alert('Oy!');
	}
	return gcc ;
}

var cl = console.log.bind( gc()+' '+ console );

var trace = false ; // для показа трассировки
					// надо где-нибудь указать
//trace = 1;
function clt( x, y = ' ', z = ' ' ){
//	console.log ( gc() + x );
	let gcl = '(-> ' + gc() + '<-)';
	if ( test_out != 'N'  ){
		console.log( gcl , x , y , z );	// выводим счетчик и послание
		if( trace ) {	// если включена трасировка
		 	console.trace( gcl );	 
		}
	}	
}; 
	

// функция getPosition() получает текущие координаты курсора
function getPos(e){
	var x = y = 0;
	if (!e) {
		var e = window.event;
	}
	if (e.pageX || e.pageY){
		x = e.pageX;
		y = e.pageY;
	} else if (e.clientX || e.clientY){
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {x: x, y: y};
};

function pI( px ){		// преобразователь строки (с пикселами)  в числа
	var px = px || '' ;
	alert('  Удалить pI ');  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	var res = parseInt( px, 10 ) ;
	if ( isNaN(res)) { res = 0; }  // для IE 
	return res ;
};

function firstNode(o){   //  возврат первого узла (ветви) дерева
	var k = Object.keys(o);
	return k[0];
};
	
// замена '<' '>' в строках
function filtrTag(msg){			
	if ( ( typeof (msg) == "string" ) 	// проверять только в строке
	&& ( msg.indexOf('<') >= 0 || msg.indexOf('>') >= 0  ) ) {	// если они есть
		msg = msg.replace( /</g, "&#060" ) ; 	
		msg = msg.replace( />/g, "&#062" ) ; 	
	};
	return(msg);
};

// убираем теги <br> <p> из строки
function filtrBR(msg){			
	if ( ( typeof (msg) == "string" ) 	// проверять только в строке
	&& ( msg.indexOf('<br>') >= 0  ) ) {	// если они есть
		msg = msg.replace( /<p>/gi, " /p/ " ) ;
		msg = msg.replace( /<br>/gi, " /br/ " ) ;
	};
	return(msg);
};

function isFunc(func){
	if ( typeof func == 'function' ) {
		return true;
	};
	return false;
};

//  - крутим картинку - идет загрузка
function ShowLoad(j) {  
	if ( j == 1 || j == 'load' || j == 'Load' || j == 'LOAD' ) {	
		cl("----showLoad---1--- LOAD") ;  
		$("#showLoad").removeClass("hide") ;  
	} else {
		cl("----showLoad------ END") ;  
		$("#showLoad").addClass("hide") ;
	};
};

	
	function Wind(id, name){
		this.id = id;
		this.name = name;
		this.width = '';
		this.height = '';
		this.color = '#333';
		this.border = '0.2em solid #eee';
		return;
	};

	function outObject( winds, tabs ){ //  to #nav  ??? не помню
		var tabs = tabs ? tabs : '';
			tabs = tabs + '&emsp;&emsp;' ;
		for ( var key in winds ) {
			if ( ( typeof  winds[key] ) != 'object' ) {
				$('#nav').html( ( $('#nav').html() )+'<hr>'+tabs+( key )+ ': ' +( winds[key] ) );
			} else {	
				$('#nav').html( ( $('#nav').html() )+'<hr>'+tabs+( 'Object:: <b>'+key+'</b>' ) );
				outObject( winds[key], tabs );
			}
			// console.log( winds[key] );
		};
	};

	//  вывод содержимого Хеша : разбор информации 
	function openArr_outHash( X, nX ){ // X - хеш , nX - имя хеша для вывода
		var out = i = iX = ''  ;
		var	nX = nX ? nX : '';
		
		for( i in X ) {							// перебор записей
			if( typeof(X[i] ) == "object" ) {	// если имеем 'object'
				iX = nX  + i + '.';				// дополняем  имя
				openArr_outHash( X[i], iX );	// переходим на следующий уровень
			} else {
				if( X[i] ) {			// если есть элемент - разбираем
					out =  X[i]  ;		// значение
					if( isFunc(out) ){ 
						out = " is function";	// функцию только объявляем
					} else { 
						out = filtrTag( out );	//	преобразуем теги в коды
					};
					out = "<span>" + nX +  i + " = <b>" + out + "</b></span><br>"  ; // оформляем результат
					$('.outHash.new').append( out ) ;	// публикуем результат
				};			
			};
		};
	};
	
	//  вывод содержимого Хеша
	function outHash( X, nX){		 	//  X - хеш , nX - имя хеша для вывода
		if ( CFG.test > 0 ) {			// если установлен режим тестирования
			var out = '' ;
			nX = nX ? nX : '_';
			nX = nX+':'
			$('#cmdW').append( '<div class="outHash new"></div>' ) ;
			openArr_outHash( X, nX );
		};
		$('.outHash.new').removeClass( 'new' ) ;
	} ;	   //  outHash


	var Morf = Morf || {};
		
	Morf = {	
		
		name: 'I em Morf',
		db: {},
		
		tools: {

		// исполнение клика по правой клавише
			rightClick: function( x ){
				var txt = '',
					templ = '';
				console.log ( 'rightClick: \n в режиме:'+ x.reg + '\n по: ' + x.path +' ( '+ x.type+' )' ) ;	
				if( x.type == 'DIR' ){
					templ = Morf.templ.rightClickMenu_DIR;	// шаблон оформления для клика по разделу
				} else {
					templ = Morf.templ.rightClickMenu;	// шаблон оформления
				};
				$( '.rightClick' ).removeClass('rightClick');
				$( x.that ).addClass('rightClick');
				txt =  Morf.tools.decorateArr(	//	оформление контекстного меню
					{	reg : x.reg,			//  доп. информация для меню
						path: x.path,			//	доп. информация для меню
						coord_x: x.coord.x,		//	координата x клика для привязки меню
						coord_y: x.coord.y		//	координата y клика для привязки меню
					},
					templ	// шаблон оформления
				);
				$( '#cntxMenu' ).css('left', x.coord.x+'px' ) 	// подставляем меню к элементу
						.css('top', x.coord.y+'px' ) 			// подставляем меню к элементу
						.html( txt );							// заполнение меню
				$( '#cntxMenu' ).show('fast') 					// показ меню
				$( '#all' ).addClass('cntxMenu' );				// по клику вне меню - закрываем его
			},  // исполнение клика по правой клавише

		// исполнение клика по элементу  - показ 
			oneClick: function( x ){
				alert ( 'в режиме:'+ x.reg + '\n кликнули по: ' + x.path+'\n типа: ' + x.type ) ;	
				var type = x.type
					co_l = 0,
					co_t = 0;
				type = type.toLowerCase();
				$( '#showZone' ).empty().attr('type', '');	
				if( type == '.gif' || type == '.jpg' || type == '.jpeg' || type == '.png' || type == '.apng'   ){
					content = '<img class="sZ" src="'+Morf.path_root+x.path+'" >';
					$( '#showZone' ).attr('type', 'img').html( content );	
					$( '#showZ' ).show('fast');
//					$( '#showZ' ).css('display','block');
				} else if ( type == '.pdf' ){
					content = '<object><embed src="'+Morf.path_root+x.path+'" width="100%" height="100%"/></object>' ;
					$( '#showZone' ).attr('type', 'pdf').html( content );	
					$( '#showZ' ).show('fast');

				} else if ( type == '.avi' || type == '.mkv' || type == '.mp3' || type == '.mp4' || type == '.mpg' || type == '.ogg' || type == '.ogv' ){
					var mime='';
					switch( type ){
						case '.avi': mime='video/avi'; break;
						case '.mkv': mime='video/x-matroska'; break;
						case '.mp3': mime='audio/mp3'; break;
						case '.mp4': mime='video/mp4'; break;
						case '.mpg': mime='video/mpg'; break;
						case '.ogg': mime='video/ogg'; break;
						case '.ogv': mime='video/ogv'; break;
					
					};
					content = '<video controls width="400" height="300"><source src="'+Morf.path_root+x.path+'" type="'+mime+'" /></video>' ;
					$( '#showZone' ).attr('type', 'video').html( content );	
					$( '#showZ' ).show('fast');


				//	content = '<video controls width="400" height="300"><embed src="'+Morf.path_root+x.path+'" type="video/avi" /></video>' ;
				//	content = '<video controls width="400" height="300" src="'+Morf.path_root+x.path+'" type="video/avi" />' ;

				} else if ( type == '.txt' || type == '.htxt' || type == '.htm' || type == '.html' || type == '.link'  || type == '.rus'  || type == '.db'  || type == '.thems'  || type == '.css' || type == '.db' || type == '.dbs'   ){
					$.ajax({
					  url: Morf.path_root+x.path,
					  dataType: 'text',
					  success: function (data) {
						data = filtrTag( data );
						$( '#showZone' ).attr('type', 'txt').html( '<pre>'+data+'</pre>' );
					  }
					});					
					$( '#showZ' ).show('fast');	
				} else { return 0; };
/*				wm = parseInt( $( '#showZone .sZ' ).width() , 10 );
				wb = parseInt( $( '#showZ'      ).width() , 10 );
				hm = parseInt( $( '#showZone .sZ' ).height(), 10 );
				hb = parseInt( $( '#showZ'      ).height(), 10 );
				console.log( 'oneClick: \nr='+wb+' - '+wm+'\nt='+hb+' - '+hm );
*/			},  // исполнение клика по элементу
			
		// преобразование в целое
			toNum: function( x ){
				return ( parseInt( x, 10 ) ) ;	
			},  // преобразование в целое

		},  //  Morf.tools

/*		//  шаблоны оформления информации
		templ: {
			workDBstr: '<a class="DBnode" ><span class="name">#name#</span><span class="param">#param#</span></a>',
			workFileNode: '<a id="#id#" class="node" type="#type#" name="#name#" id_tree="#id_tree#" path="#path#" title="name =#name#\n size = #size#\n type = #type# "><span class="first"></span><span class="parDop icon" style="background-image: url(#path_root##path#)">#type#</span>	<span class="name">#name#</span> [[<span class="parDop size">#size#</span>]]<span class="parDop type">#type#</span><span class="last"></span></a>',
			navFileTree: '<div id="tree_#key#"  class="tree_node"  trg="#trg#"  parent="no" level="#level#" path="#path#" >#tabs#<span class="mark_clop"></span> <a title="#title#">#name#</a><br>',
			navDB: '<div id="db_#table#"  class="db_node" path="#table#" ><span class="mark_clop"></span> <a title="#table#">#table#</a><br>',
			rightClickMenu: '<span>в режиме:#reg#</span><br><span>элемент:#path#</span><br><span> x:#coord_x#</span><br><span> y:#coord_y#</span>',
			rightClickMenu_DIR: '<span><a class="reload_DIR" path="#path#" > обновить </a><br>в режиме:#reg#</span><br><span>элемент:#path#</span><br><span> x:#coord_x#</span><br><span> y:#coord_y#</span>',
			breadСrumb_DB_0_Nav : '<span class="db_crn" path="" title="обновить" ><a>&bull;</a></span>' ,	// переход на параметры базы, нет подстановок
			breadСrumb_File_0_Nav : '<span class="crn tree_node" parent="yes" type="DIR" path="" ><a>&bull;</a></span>' ,	// переход на "корень дерева", нет подстановок
			breadСrumb_File_0 : '<a class="last path"  type="DIR" path="" >&bull;</a>' ,	// переход на "корень дерева", нет подстановок
			breadСrumb_File : '<span  class="del" > &rsaquo; </span><a class="last path" type="DIR" path="#path#" id_tree="#id_tree#" >#step#</a>',
			reg_menu_file : "<span id='list' class='reg_view tek' view='list'>список</span> <span id='tabl' class='reg_view' view='tabl'>таблица</span> <span id='plit' class='reg_view' view='tile'>плитка</span>" ,	
			reg_menu_db : "<span id='data' class='reg_view' view='data'>данные</span> <span id='struct' class='reg_view' view='strct'>структура</span> <span id='query' class='reg_view' view='query'>выборка</span>",	
			reg_menu_prog : ' ',	
			workW_file : '<div id="path" class="path" ></div><div id="workC" class="wrk" ></div>',	
			navFileTreeD: '--- key = #key#" --- trg = #trg#" --- level="#level#"  --- path="#key#"  --- tabs = #tabs#  --- title = "#title#"  ---  name = #name#' 
			
		},	// templ

/*  */
		// 	Morf.scr - функционал изменения границ окон/панелей приложения
		scr: {
			width :  $("#all").css('width'),
			height:  $("#all").css('height'),

 			
			resize : function() {  // получение размеров экрана
				var t = Morf.tools ,
				    allW  = t.toNum( $('#all').css('width') ),
				    allH  = t.toNum( $('#all').css('height') ),
				    wzT   = t.toNum( $('#work_zone').css('top') ),
				    wzH   = t.toNum( $('#work_zone').css('height') ),
				    bufW  = t.toNum( $("#buf").css('width') ),
				    botH  = t.toNum( $("#bot").css('height') ),
				    cmdL  = t.toNum( $("#cmd").css('left') ),
					emW   = t.toNum( $("#em").css('width') ), 
					emH   = t.toNum( $("#em").css('height') ), 
					d 	  = allH - wzT - botH ;
		
				$('#wb').css('left', ( allW - bufW ) ) ; 
				$('#bb').css('top',  ( allH - botH ) ) ; 
				$('#work_zone').css('height', ( d ) );
				$('#nav').css('height',  ( d ) );
				$('#nw').css('height',   ( d - emH ) );
				$('#work').css('height', ( d ) );
				$('#wb').css('height',   ( d - emH ) );
				$('#buf').css('height',  ( d ) );
				$('#bb').css('width',  allW - cmdL - emW );
				$('#cmd').css('width', allW - cmdL );
			},		// resize : function()   // получение размеров экрана


			nw_gr_position: function (){	// между nav и work  - но горизонтально
				var x = all = 0 ,
					d = em = 0 , 
					t = Morf.tools ;

				$("#nw_gr").draggable(
					{	axis:'y' },	
					{ 	containment:'parent' },
					{ 	start:function(){
							all = t.toNum( $("#all").css('height') ); 
							em 	= t.toNum( $("#em").css('height') ); 
						}
					},
					{ 	drag: function(event, ui){
							x = t.toNum( ui.position.top ) ; 
							d = all - x  ;

							$("#nav").css('height', 	x-0  ) ;
							$("#work").css('top', 	x+7 ) ;
						}
					}
				);	 
			}, 	// nw_gr_position: function ()  // между nav и work


			nw_position: function (){	// между nav и work   - но вертикально
				var x = all = 0 ,
					d = em = 0 , 
					t = Morf.tools ;

				$("#nw").draggable(
					{	axis:'x' },	
					{ 	containment:'parent' },
					{ 	start:function(){
							all = t.toNum( $("#all").css('width') ); 
							em 	= t.toNum( $("#em").css('width') ); 
						}
					},
					{ 	drag: function(event, ui){
							x = t.toNum( ui.position.left ) ; 
							d = all - x  ;

							$("#nav").css('width', 	x-2  ) ;
							$("#work").css('left', 	x ) ;
						}
					}
				);	 
			}, 	// nw_position: function ()  // между nav и work
		 
			init: function (){
				console.log( ' its SCR.init ' );
				this.resize();
				this.nw_position();
				this.nw_gr_position();
				ShowLoad(0);
				window.onresize = function() {  Morf.scr.resize() };
				
				// установка режима workW в зависимости от nav
				$("#workW").attr('reg', $("#nav .reg_view.tek").attr('view') );
				
			}
		} 	//     Morf.scr
	};




// ---------------------------------- подвал ------------------------------------------ //

/*		

*/