/*
*		Morf
*/

$(document).ready(function(){

	var tab	= '' ;

	// 105 #navW-click,.db_node     Nav, DB, выбор таблицы 
	$("#navW").on('click',".db_crn", function(){ 
		cl( ' 105 #navW-click,.db_crn');
		localStorage.removeItem('Morf.db');
		Morf.start();
	});

	// 101 #navW-click,.db_node     Nav, DB, выбор таблицы 
	$("#navW").on('click',".db_node", function(){ 
		cl( ' 101 #navW-click,.db_node');
		var table = $(this).attr('path');
		Morf.sts.db_table = table ;
		$("#navW .curent").removeClass('curent');
		$(this).addClass('curent');
//		Morf.selector( $(this).attr('reg') );
		cl( ' 101 #navW-click,.db_node table:'+ table);
		Morf.tools.showDBtable( table, 'data'); // ( table, 'strct');
	});
	
	// 102 #navW-click,.tree_node[parent=yes] > .mark_clop   открываем/закрываем узел на дереве
	$("#navW").on('click',".tree_node[parent='yes'] > .mark_clop", function(){ 
		cl( ' 102 #navW-click,.tree_node[parent=yes] > .mark_clop');
		$(this).parent(".tree_node").toggleClass('open');
	});

	// 103 #navW"-click tree_node>a   Nav, Tree открываем/закрываем узел на дереве + показ содержимого
	$("#navW").on('click',".tree_node > a", function(){ 
		cl( ' 103 #navW"-click tree_node>a');
		var that = $(this).parent(".tree_node") ;
		var cur_path = $(this).parent(".tree_node").attr('path') ;
		cl( '--->>> Click-navW: '+cur_path +' <<<-------')

		Morf.tools.treeNodeCurent(that);  // "текущий" узел на дереве
		Morf.tools.request( 'dirShow', cur_path );

	});	// открываем/закрываем узел на дереве + показ содержимого
	
	// 104 #workW-click, a.node[type=DIR]  открываем узел  в показе содержимого
	$("#workW").on('click', "a.node[type='DIR']", function(){ 
		cl( ' 104 #workW-click, a.node[type=DIR]');
		var path = $(this).attr('path') ;
		var that = '#tree_'+ $(this).attr('id_tree') ;
	//	alert( '--->>> Click-workW: a --- id: '+path+'  tt: '+that  );
		cl( '--->>> Click-workW: a --- id: '+path+'  tt: '+that  );
		Morf.tools.treeNodeCurent(that);  // "текущий" узел на дереве

		Morf.tools.request( 'dirShow', path);

	});	// открываем узел  в показе содержимого

	//001 #nav-click меняем режим отображения в окне nav
	$("#nav .reg_view").on('click', function(){ 
		cl( ' 001 #nav-click');
		Morf.selector( $(this).attr('reg') );
	});

	//002 #work-click меняем вид отображения в рабочем окне(#work) для file 
	$("#work[reg='file']").on('click','.reg_view', function(){ 
		cl( ' 002 #work-click');
		Morf.selector( $(this).attr('view') );
	});

	//003 #work-click меняем вид отображения в рабочем окне(#work) для db
	$("#work[reg='db']").on('click','.reg_view', function(){ 
		cl( ' 003 #work-click');
		Morf.selector( $(this).attr('view') );
	});


	//201 .cmd_button-click запрос SELECT для db
	$("#cmd").on('click','.cmd_btn', function(){ 
		cl( ' 201 .cmd_button-click');
		Morf.selector( 'query' );
	});




	//202 назначение контекстного меню на элементы "навигатора" зоны DB
	$('#work').on( 'contextmenu', '#workW .node',function(e){
		$( this ).addClass('rightClick');
		Morf.tools.rightClick( {
			coord: getPos(e),
			reg	: $("#workW").attr('reg'),
			that: this,
			type: $( this ).attr('type'),
			path: $( this ).attr('path')
		}); 
	});	


	//203 назначение контекстного меню на элементы "рабочей" зоны
	$('#work').on( 'contextmenu', '#workW .node',function(e){
		$( this ).addClass('rightClick');
		Morf.tools.rightClick( {
			coord: getPos(e),
			reg	: $("#workW").attr('reg'),
			that: this,
			type: $( this ).attr('type'),
			path: $( this ).attr('path')
		}); 
	});	

	//204 команда "обновить" контекстного меню "рабочей" зоны
	$('body').on( 'click', '#all.cntxMenu #cntxMenu a.reload_DIR',function(e){
		var path = $(this).attr('path') ;
		Morf.tools.reload_DIR( path );
	});	
	
	//205 показ элемента по клику на него
	$('#workW').on( 'click', '.node',function(e){
		cl (' 205 показ элемента по клику на него ');
		if( $( this ).attr('type') != 'DIR' ){	
			Morf.tools.oneClick( {
				reg	: $("#workW").attr('reg'),
				that: this,
				type: $( this ).attr('type'),
				path: $( this ).attr('path')
			}); 
		};
	});	

	//206 сокрытие элемента по клику вне его
	$('#cllcZ, #showZ').on( 'click', function(e){
		console.log ( '206  clck #showZ ---  WM_morf.js ---' );
		$( this ).hide();
		$( this ).children('.gallery').html('');
	});

	// отключили "системное" контекстное меню 
	$("body").contextmenu(function(){return false;});	
	//document.oncontextmenu = function(){return false;};
	// закрытие контекстного меню
	$(document).on('mouseup', '#all.cntxMenu',function (e){
		var container = $("#cntxMenu");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			container.hide();
			$( '.rightClick' ).removeClass('rightClick');
		}
	});


	//  enter: вход
	$('a.submit.enter').on('click', function() { 
		my = {
			enter      : 'enter',
			login      : $('input.login').val(),
			password   : $('input.password').val(),
			not_ip     : $('input.not_ip').prop("checked"),
		};
		console.log ( my );
		Morf.tools.enter.post_qu( my );
	});  //  вход
	
	//  enter: регистрация
	$('a.submit.register').on('click', function() { 
		my = {
			enter      : 'register',
			login      : $('input.login').val(),
			password   : $('input.password').val(),
			not_ip     : $('input.not_ip').prop("checked"),
		};
		console.log ( my );
		Morf.tools.enter.post_qu( my );
	});  //  регистрация
	

	// Точка входа
	( function() { 
		cl ( '+ Точка входа' );
		Morf.scr.init();
		txt = '[name]';
		txt = Morf[txt];
		$("#dgn").html("<b>"+txt+"</b>");
/*
	console.log( Morf );
	console.log( Morf.name );
*/
	}()); 


});
