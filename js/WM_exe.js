// 	background-image: url(bckg.jpg); 

var gcc = 0; 		// "глобальный" счетчик
var sel_node = 0;	// "корневой" узел 
var nodes = [];		// массив узлов
var iid = 0;
var temp = ''; 		// место для временного хранения
var series = {}; 	// место для хранения подборок для показа в Галерее
var relation = {};
var relations = {};
var tron = {};
var sibiling = new Map();
var siblings = new Map();
var slinks = new Map();
const start_point = 'ПетрI' ; // точка начала 
//const start_point = 'АлексейМихайлович' ; // точка начала для "не графа" 5

var kin_def = {
	'дочь': 'сестра',	
	'сын': 'брат',
	'трон': 'трон',
}	

/*   function readJSONimage()
	$.getJSON("data/list.json", function( all_data ) {
		console.log("Start point 1.");
		console.log( all_data );
		chef( all_data );
	});
*/

// *** ---------- блок настроек дерева --------------------------начало---- *** 
{   
	var o_layout = {
		randomSeed: undefined,
		improvedLayout:true,  // иерархия вклю(выклю)чается ЗДЕСЬ  true/false
	//	clusterThreshold: 150,		//  -----------------------
		hierarchical: {
		  enabled: true, //false, //true,		// включить иерархическое отображение
		  levelSeparation: 150,  // расстояние между уровнями
		  nodeSpacing: 130,
		  treeSpacing: 20,
		  blockShifting: true,
	//	  edgeMinimization: true,	// ----------------------
	//	  parentCentralization: true,		// ------------------
		  direction: 'UD',        // UD, DU, LR, RL
		  sortMethod: 'directed',  // hubsize, directed
	//	  shakeTowards: 'levels'  // levels, roots, leaves
		}
	}		  

	var o_nodes = {
		borderWidth: 3,//Настройка ширины границы узла
		borderWidthSelected: 7,//Нажмите на настройку ширины при выборе,
	//		shape: "circularImage",   // тип отображения узла
		shape: "image",
		shapeProperties: {
		  useBorderWithImage: true,
		},			
	//	imagePadding: 20,			
		size: 70,
	//  scaling: { customScalingFunction: function (min, max, total, value) { return value / total; }, min: 5,  max: 150, },

		font: { 
			size: 12 ,

	//		background: "white",

		},
		shadow: true
	}
			  
	var	o_edges = {
	//	value: 1, //  толщина линии связи
		width: 2,
		hoverWidth: 4,
		shadow: true,
		smooth: true,			// скругление линий связи
    /*    background: {
            enabled: true,
            color: "#ff0000",
        },*/
		arrows: { to: true }	//	показание направления связи стрелкой
	}
			  
	var o_physics = {
		enabled: true,  
		hierarchicalRepulsion: {  avoidOverlap: 10 	},
		
		maxVelocity: 6,
		timestep: 0.35,
	//	stabilization: { iterations: 150 } ,
		
		stabilization: {
			enabled: true,
			iterations: 150,
			updateInterval: 50,
			onlyDynamicEdges: false,
		//	fit: false
		},
	//	solver: "barnesHut",
 	//	solver: "forceAtlas2Based",
 /* 	
	forceAtlas2Based: {
			gravitationalConstant: -26,  
			centralGravity: 0.005, 
			springLength: 120,  
			springConstant: 0.18,    
		}, 
		
  	
	barnesHut: {
		theta: 0.5,
		gravitationalConstant: -25000,
		centralGravity: 0.3,
		springLength: 195,
		springConstant: 0.04,
		damping: 0.09,
		avoidOverlap: 0
	},
*/				


/**/}

}
// *** ---------- блок настроек дерева --------------------------начало---- *** 

	// функция построения дерева графов 
   function draw() {
        
	cl( "draw():: nodes_0{}: ", nodes_0 );
		
		var container = document.getElementById("mynetwork");
        var data = {
			nodes: nodes,
			edges: edges,
        };

        var options = {
			autoResize: true,
			height: '100%',
			width: '100%',
			
	//	 smoothCurves: true,
	//	 freezeForStabilization: false
			
			nodes:   o_nodes,
			edges:   o_edges,
			physics: o_physics, 
			layout:  o_layout 
        };
        var network = new vis.Network(container, data, options);
		
		// переход по клику по точке в дереве
		network.on("click", function (params) {
			cl('draw():: clck goto_next:'+ gc() + ' ' + ' params ' + params )
			goto_next(params);
		});
	  
   }  //  function draw()


// стартовая функция
// и запуск реакций страницы
   function start() {
	console.time();
	cl( "start():: nodes_0{}:", nodes_0 );

	
		prepare_data();
		draw() ;	//  отрисовка графа  !  ОТКРЫТЬ

		activities();  //  назначение "активностей" / реакций на объекты

		console.log('Готов!');
		goto_node( start_point );		// переход на начальную точку 

	console.log('End function start() ');
	console.timeEnd();
   }	


	function on_off( subj, on, off ) {
		return ( subj == on )  ? subj = off : subj = on ;
	}


	// сброс "изменений" стиля расположения окон
	function clear_style() {
		$("#nav").removeAttr('style');
		$("#work").removeAttr('style');
		$("#nw_gr").removeAttr('style');
		$("#nw").removeAttr('style');
	}

	//  очистка места под вывод новых данных
	function clear_place() {
	//	$('#image_top').empty();
		$('#image').empty();
		$('#title').empty();
		$('#picts').empty();
		$('#family').empty();
		$('#anons').empty();
		$('#text').empty();
		$('#vitae').empty();
		$('#lifeyears').empty();
		
	}

	// получение данных media ресурса
	function get_media( key ) {
//		cl( 'get_media: ' + key  );	console.log( media[key] );
//		return media[key] ;
		return libImages[key] ;
	}

	// получение данных media ресурса image
	function get_media_image( key, type='n' ) {
	//	cl( 'get_media: ' + key  );	 // console.log( media[key] );
		let media_temp = get_media( key );
		if( type == 's' ||  type == 'small' ||  type == 'm' ||  type == 'mini'   ) { 
			type == 's';
		} else if( type == 'b' ||  type == 'big'   ) { 
			type == 'b';	
		} else { 
			type = 'n';  
		}
		type = 'image_' + type;
	//	console.log ( media_temp );
		return media_temp[type] ;
	}
	

	//  показ картинки из галереи крупно 
	function show_image( curent, name_series ) {
		let img_cur ;
		let cur_id = 0;
		let max = 0;

		cl( 'show_image:вход:: curent: '+curent+'; name_series: '+name_series);

		series[name_series].forEach(
			function( index, img ){
				if( curent == index ){ cur_id = img ; } 
				max++;
			//	cl( 'show_image: index:' + index+'; img: '+img+';' );
			}
		);
		max--;
		cl( 'show_image: cur_id: ' + cur_id + ' [ ' + series[name_series][ cur_id ] + ' ] from ' + max );
		img_cur = libImages[ curent ] ;
	//	cl( img_cur );


		let prev = ( cur_id > 0 ) ? cur_id-1 : max ;
		let next = ( cur_id < max ) ? cur_id+1 : 0 ;
		let data_id = $(' .image img[id='+cur_id+']' ).attr('data_id')
			data_id = ( data_id !== 'undefined' ) ? data_id : "" ;
			cl( "show_image( "+ cur_id + " ) length: "+ max +" :: left: "+ prev + " right: "+ next );

			$("#show_image").addClass( 'show' );
			$("#show_image img").attr("src", img_cur.image   )
								.attr("title", img_cur.title  )
								.attr("id", img_cur.id  );
			$("#show_image #left").attr("slot", series[name_series][ prev ] )
								  .attr("name", name_series );
			$("#show_image #right").attr("slot", series[name_series][ next ] )
								   .attr("name", name_series );
			$("#show_image figcaption").text( img_cur.title  )
									   .attr( "id", img_cur.id );
 /* */ }

	// переход на узел по его клику на нижней галерее
	function goto_next2(params) {
		console.log( "goto_next2:::params.target.id  ---> "+params.target.id+ " <---"  );
		if ( params.target.id ) {
			goto_node( params.target.id );
		}
   }

	// переход на узел по его клику на нём в дереве
	function goto_next(params) {
        params.event = "[original event]";
		goto_node(params.nodes)
      }
		
	// переход на узел по его id 		!!! переписать полностью!!!
	// на входе число - переход с графа идет по чису
	// если на входе строка - переход не из графа
	function goto_node(node) {		
	
		cl( 'goto_node:: ( '+node+' )  typeof: ' + typeof( node )  );
		if ( typeof( node ) != 'string' ) {
			if (  nodes[node] === undefined  ) { 
	//			cl( 'node Пуст Ой' );
				return false;
			}	
			node = nodes[node].key ; 	// переход от числового индекса к строковому
		}
		//  блок очистки места под вывод новых данных
		clear_place();

		iid = 0;			// обнуляем глобальный счётчик
		if( txts[node] ){	// если узел описан - оформляем его
	//		cl( 'goto_node::: txts[ '+node+' ]: ');	console.log(  txts[node] );

			// у узла обычно есть "название"
			$('#title').text( txts[node].title )
						.attr( "sel_node", node );
			
			if ( txts[node].lifeyears ) {	 			// у узла может быть даты жизни
				$('#lifeyears').text( txts[node].lifeyears ) ;				
			}
			
			if ( txts[node].image ) {	 			// у узла может быть "изображение"
	//			cl(' data_image(txts['+node+'].image )'); cl(data_image(txts[node].image));
			
				$( '#image' ).append( decorate_one( // оформление изображения
					data_image(  					// собираем данные 
						txts[node].image ), 		// об изображении
						templs.image_size_n 	// шаблон оформления изобрашения размером n
					)
				);					
			}; 
			
			$('#anons').html( txts[ node ].anons );	//  текст из txts
			
			// если есть "жизнеописание" - публикуем // сделать 1 функцию с видео
			if ( txts[ node ].vitae ){
		//		cl("goto_node::  vitae --> " + txts[ node ].vitae );
				let name = "";
				let type = "";
				let params = {};
				[ name, type ] = txts[ node ].vitae.split(':') ;
				// выбор описания исходя из типа "описания"
				if ( name in docs ) {   // вообще-то здесь нужна проверка
					switch( type ){ 
						case 'docs': 
						params = docs[ name ];
						params.group = type;
						break;						
					}
					cl( params );

					$('#anons').append( 
						decorate_one( 
							params,
							templs.open_add_info
						)
					);	//  текст из txts
				}
			};

			// если есть "главное" видео - публикуем// сделать 1 функцию с жизнеописанием 
			if ( txts[ node ].video ){
		//		cl("goto_node::  video ------------> " + txts[ node ].video );
				let name = "";
				let type = "";
				let params = {};
				[ name, type ] = txts[ node ].video.split(':') ;
				// выбор описания исходя из типа "описания"
				if ( name in video ) {  //  если есть такая запись
					switch( type ){ 
						case 'video': 
						params = video[ name ];
						params.group = type;
						break;						
					}
		//			cl('goto_node:: params: '+ params );

					$('#anons').append( 
						decorate_one( 
							params,
							templs.open_add_info
						)
					);	//  
				}
			};	
			
			detect_siblings( node ); //   собираем "родню"  текущего узлаы
			//		
			$( "#main" ).animate({"scrollTop":0},"slow");		// неКрасиво... надо пересчитывать...

			// публикация "родителей"
			out_relatives_picts( node, 'parent', '#family'  );

			//  вывод "супругов"  
			out_relatives_picts( node, 'spouses', '#family'  );

			//  вывод "братьев и сестер"  
			out_relatives_picts( node, 'siblings', '#family'  );

			//  вывод "детей"  
			out_relatives_picts( node, 'children', '#family'  );
			
			Glr.add( node );		
			//  вывод галлереи всего разного
			$('#gallery').attr('name', node ); // подпись для галлереи
			put_glr_picts( txts[ node ].glr, '#picts' );
			

		}	
    }

	//  вывод "родни" out_relatives_picts( tema, relation_status, place_out )
	//	tema 			- чью родню выводим
	//	relation_status - в каких отношениях родня
	//	place_out 		- куда выводим
	function out_relatives_picts( tema, relation_status, place_out ) {
	//	cl( 'out_relatives_picts( tema:' + tema + ' relation_status:'+relation_status+'  )' ) ; 	console.log( relations[tema] );
		for( let tec in relations[tema] ){	// // просматриваем родню tema
			if( relations[tema][tec]['status'] == relation_status ) {	// если "родня" в соответствующем отношении
	/*			cl( 'out_relatives_picts: tema:'+tema+" -> tec:"
				+tec+" : "+relations[tema][tec]['status']+" : "+relations[tema][tec]['kin'] );
	/* */			temp = decorate_one( 
					data_relative( tec, tema ), 	// собираем данные 
					templs.image2figure 			// шаблон оформления
				);
				$( place_out ).append( temp );			
			}
		}
	}	

	//  определение списка братьев и сестер для их показа
	//	tema - чью родню выводим
	function detect_siblings( tema ) {
	//	cl( 'detect_siblings::  tema: ' +  tema  ) ;
	//	cl( 'detect_siblings:: siblings.get( '+tema+' )  :: ' + siblings.get(tema) ) ;

		// если родня в этой теме ещё не искалась, то ищем
		if( siblings.get(tema) != 'yes' ){	 
			for( let tec in relations[tema] ){ 	// просматриваем родню tema
		//		cl( 'detect_siblings:: tema: '+tema + " -> " + tec ); cl( relations[tema][tec] );
				if( relations[tema][tec]['status'] == 'parent' ) {	// если tec - родитель
		//			cl( 'detect_siblings:: tema: '+tema+" -> "+tec+" : "+relations[tema][tec]['status'] );
					for( let kin in relations[tec] ){		// просматриваем родню tec
						if( relations[tema][kin] === undefined   ) {  // если родственная связь уже записана - проходим мимо
							let child = relations[tec][kin] ;
							// если родня - потомок и не он сам
							if( ( child['status'] == 'children' ) && ( tema != kin ) ) { 
		//						cl('detect_siblings:: tema: '+tema+" ->tec: "+tec+" ->kin: "+kin ); cl(child);
		//						cl('detect_siblings:: child[ status ] - '+child['status']+' , child[ kin ] - '+child['kin'] );
								let temp = {};	// временное хранилище присоединяемого отношения
								temp[ kin ] = {	// собираем подключаемые свойства в объект
									status: 'siblings',
									kin: kin_def[ child['kin']  ],
								};
		//						cl( 'новая запись: ['+tema+']['+kin+'] = temp[ kin ]');
		//						cl( temp[ kin ] )
								relations[tema][kin] = temp[ kin ];
							}
						}
					}
				}
			}
			siblings.set( tema, 'yes' );	// отмечаем, что отношения уже искались, но могли быть не найдены
		//	cl( 'detect_siblings : relations[ tema ]', relations[ tema ] );
		
		} else {
			cl( 'detect_siblings:: siblings для' + tema + ' уже определены' ) ;
		}
	
		cl( 'detect_siblings - end' ) ;
	}	// detect_siblings()


	//  определение галереи для показа
	function put_glr_picts( baza, place ) {
		if ( baza ){
			cl( ' put_GLR_picts: place:: '+place+'  baza{}::' , baza  );
/**/		let media = '';
			let name  = '';
			let m ;			// media объект
			let properties = {};	// свойства объекта
			let template   = '';	// шаблон оформления объекта
			
			$( place ).html(''); 
			
			$( "#gallery" ).animate( {"scrollTop":0}, "slow" );
			for( let i of baza ) { // получили запись типа "001": "image"
				name = Object.keys( i )[0];		// взяли имя 
				media = i[ name ];				// взяли вид / тип

				m = get_media( name );
		//		cl( ' put_glr_picts: media: ' + media + ' - name: ' + name , m );
		
				switch( media ) { 	//  выбор представления элемента в Галерее
					case 'image': 
						properties	= data_image( name ); 	// собираем данные 
						template	= templs.image2figure; 	// шаблон оформления
					break;
					case 'video': 
						properties	= data_video( name ); 	// собираем данные 
						template	= templs.image2figure; 	// шаблон оформления
					break;
					case 'collections': 
						properties	= data_collections( name ); 	// собираем данные 
						template	= templs.collection2figure;		 	// шаблон оформления
					break; 					
					default:
						cl('Oшибка в определении элемента галереи\n '+name+' :: '+media);
						alert('Oшибка в определении элемента галереи\n '+name+' :: '+media);
				}		
				// если объект properties имеет свойства - можно его оформлять
				if( Object.keys( properties ).length > 0 ){
					temp = decorate_one( properties, template );
					$( place ).append( temp ); 
				}
			}
//			console.log( "put_GLR_picts ------- end ------------put_GLR_picts "  );
		}
	}  // function put_glr_picts( baza, place )

	// оформление данных изобрашения в html
	// данные изображения передавать объектом
	function decorate_one( X, templ ){  
		//cl( 'decorate_one::templ: '+ templ +' ' , X )
		if( !!templ ){ 				// проверка на наличие шаблона оформления
			for( let i in X ) {			// перебор свойств
				if( typeof( X[i] ) == "object" ) {			// если вместо свойства имеем 'object'
		//			cl( 'decorate_one: ОШИБКА -> [object] <- переход на следующий уровень' );
					templ = decorate_one( X[i], templ );	// переходим на следующий уровень
				} else {
					if( typeof X[i] ) {		// если есть элемент 
						var rX = new RegExp( "#" + i + "#", 'g' );	// регулярное выражение для подстановки
							templ = templ.replace( rX , X[i]  );	// заменяем имена в шаблонах на значения
		//					cl('decorate_one: rX ['+rX+'] -->  tX ['+X[i]+'] '); cl('OUT: ['+templ+']');
					};			
				};
				if (  templ.search( /#/ )  < 0 ){	// проверка на не заполненные поля в шаблоне
		//			cl ( 'decorate_one: шаблон [temp] заполнен:  ' + templ  );		
					break;	// если заполнять нечего - на выход
				} else {
		//			cl( 'decorate_one:templ::' + templ );
				};
			};
		} else { 
			cl( "Ошибка открытия шаблона оформления в decorate_one");
		//	alert( "Ошибка открытия шаблона оформления в decorate_one");
		};	
		return templ ;	
	}	
/*	*/	

	// вывод оформленого элемента на указаную площадку
	//	baza - id собственно выводимой персоны 
	//	parnt - id учетного "родителя"  выводимой персоны для определения отношения
	
	function data_relative( baza, parnt ) {
	//	cl ( ' data_relative---> baza:'+baza+', parnt:'+parnt+' -----------------------------------' );
	//	console.log (  txts[baza]  );  console.log ( txts[parnt] );
		let caption = '';
		let m = {};		// media объект
		let D = {};		// данные публикуемой персоны

		if ( txts[baza] ) {
			if ( txts[baza].image ) {
				caption = txts[baza].label;		//  подготовка подписи для снимка
				if( relations[ parnt ][ baza ][ 'kin' ] ) {	// если есть "отношение" - добавляем в подпись
	//			cl( 'relations[ parnt ][ baza  ]' );  	cl( relations[ parnt ][ baza  ] ); 
					caption += '<br>( '+ relations[ parnt ][ baza  ][ 'kin' ]+ ' )'; 
				}
				m = get_media( txts[baza].image );
			//	console.log ( 'media объект', m );
				if (  m != undefined ){
					D = {
						'type'	 : 'image',
						'class'	 : 'relative',
						'id' 	 : iid,
						'data_id': baza,
						'label'  : txts[baza].label,
						'title'  : txts[baza].title,
						'caption': caption,
						'image'  : m.image,				
						'image_s': m.image_s,				
						'image_n': m.image_n,					
					};
				} else {
					cl( 'data_relative, ошибка - отсутствует описание изображения: ', txts[baza].image   );
				}
			}	
		}	
	//	cl( D );
	//	cl (' end data_relative() -----------------------------------');
		return D;
	}	// function data_relative( baza, parnt )

	function data_collections( cur ) {
		let m = {};		// media объект
		let D = {};		// данные collections

			m = collections[ cur ];
		//	console.log ( 'data_collections:: media объект:', m );
			let img =  data_image( m.image );
			D = {
				'type'	 : 'collections',
			//	'type'	 : 'image',
				'class'	 : 'show_collection',
				'id' 	 : m.id,
				'data_id': cur,
				'label'  : m.label,
				'title'  : m.title,
				'caption': m.txt,
			//	'caption': m.title,
				'image'  : img.image,				
				'image_s': img.image_s,				
				'image_n': img.image_n,					
			};
/*
			cl('data_collections: ' + cur , img ); 
*/
		return D;
	};

	function data_video( cur ) {
		let m = {};		// media объект
		let D = {};		// данные video

			// проверка и сообщение об ошибке если не найдена запись cur
			m = video[ cur ];
	//		console.log ( 'data_video:: media объект: ' + cur , m );
			let img =  data_image( m.image );
			D = {
				'type'	 : 'video',
				'class'	 : 'show_video',
				'id' 	 : m.id,
				'data_id': cur,
				'label'  : m.label,
				'title'  : m.title,
				'caption': m.title,
				'txt'	 : m.txt,
				'image'  : img.image,				
				'image_s': img.image_s,				
				'image_n': img.image_n,					
			};
/*
*/		//	cl('data_video: ' + cur, img ); 

		return D;
	};

	
	function data_image( cur ) {
		let caption = '';
		let m = {};		// media объект
		let D = {};		// данные image

	//		cl ( ' data_image---> image: [ '+cur+' ] ' ,  libImages[cur]  );  
			//  !!!  поставить проверку наличия libImages[ cur ]
			if (  libImages[cur] != undefined ){
				m = libImages[ cur ];
		//		console.log ( 'data_image:: media объект:', m );
				D = {
					'type'	 : 'image',
					'class'	 : 'show_pict',
					'id' 	 : m.id,
					'data_id': cur,
					'label'  : m.label,
					'title'  : m.title,
					'caption': m.title,				
					'txt': m.txt,
					'image'  : m.image,				
					'image_s': m.image_s,				
					'image_n': m.image_n,					
				};
			} else {
				cl ( ' data_image---> отсутствует описание в libImages для: [ '+cur+' ] '  );  
			}

	//	cl( D );
	//	cl (' end data_image() -----------------------------------');
		return D;
	};


	// определение семейного статуса - "уровня"
	function family_status( rel ) {	
		if( rel == 'отец' || rel == 'мать' ) { return ('parent'); }
		if( rel == 'муж' || rel == 'жена' ) { return ('spouses') ; }
		if( rel == 'сын' || rel == 'дочь' ) { return ('children'); }
		if( rel == 'брат' || rel == 'сестра' ) { return ('siblings'); }
		if( rel == 'трон' ) { return ('tron'); }
	}

	// переопределение семейного положение в "обратную" сторону
	// rel=''  - текущее отношение
	// status  - текущий статус
	// kin=''  - key для определения gender 
	function family_resp( rel, status, kin='' ) {
	//	cl( ' family_resp( rel: '+rel+' , status: '+status+' , kin: '+kin+' )' )
		
		if( rel == 'муж' && status == 'spouses' ) { 
			return ( { 'status': 'spouses', 'kin':	'жена' } ); 
		}
		if( rel == 'жена' && status == 'spouses' ) { 
			return ( { 'status': 'spouses', 'kin':	'муж' } ); 
		}
		if( ( rel == 'сын' || rel == 'дочь' ) && status == 'children' && txts[kin]['gender'] == 'ж' ) { 
			return ( { 'status': 'parent', 'kin': 'мать' } ); 
		}
		if( ( rel == 'сын' || rel == 'дочь' ) && status == 'children' && txts[kin]['gender'] == 'м' ) { 
			return ( { 'status': 'parent', 'kin': 'отец' } ); 
		}
	}


	// prepare_data - обработка/перестановка исходных данных для работы ---! переделать Полностью!!!!!
	function prepare_data () {	
		//console.log( "-> function prepare_data () <---- begin -" );

		var arc = [];
		var only = new Set();
		nodes = [];
		
		cl( "prepare_data():: nodes_0{}:" , nodes_0 );
		
		// пересортировка массива узлов в соответсвии с id узлов
		nodes_0.sort( function(a, b) {
			if (b.id < a.id) {
				return 1;
			}
			return -1;
		})

		//  собираю из nodes отдельный набор отношения между элементами 
		//  и очищаю nodes от этой информации
		cl( 'prepare_data: собираю из nodes - relations ( из узлов их отношения) ' );
		let nl = nodes_0.length;
		for ( let i = 0; i < nl; ++i ) {	// перебираю nodes
			if ( nodes_0[i].to ){			// если есть  список исходящих связей
				let ntl = nodes_0[i].to.length ;		// длинна списка исходящих связей
				if (  ntl > 0 ) {						// если есть исходящие связи
					let node_base = nodes_0[i].key ;	// сокращаю имя базовой записи
					let rel = '';						// переменная для вида связи / отношение
					for ( let j = 0; j < ntl ; ++j ) {	// перебираю список исходящих связей
						// извлекаю  вид связи / отношение из записи 
						[ nodes_0[i].to[j], rel ] = nodes_0[i].to[j].split(':');  
						if ( rel  ){		// если rel обозначен - обрабатываю
							let node_tek = nodes_0[i].to[j] ;	// сокращаю имя текущей записи
			//				cl('prepare_data():: '+ node_base+' : ' +i+ ' / '+j+' :: ' + node_tek + ' : ' + rel );
							// если базовой записи нет в наборе отношений, то создаю 
							if ( relations[ node_base ] == undefined ) {  relations[ node_base ] = {}; }
							// если у базовой записи нет отношений с текущей записью, 
							// то добавляю и обрабатываю обратные отношения
							let status = family_status( rel );
							if ( status == 'tron'  ) { 
								nodes_0[i].to[j] = nodes_0[i].to[j] + ':' + status ;
			//					cl('prepare_data():: tron -> nodes_0['+i+'].to['+j+'] '+nodes_0[i].to[j]+' status = [ '+status+' ]' ) ;
							} else if ( relations[ node_base ][ node_tek ] == undefined ) { // || status == 'tron' 
								relations[ node_base ][ node_tek ] = {} ;
								relations[ node_base ][ node_tek ][ 'status' ] = status ;
								relations[ node_base ][ node_tek ][ 'kin' ] = rel ;
								relations[ node_base ][ node_tek ][ 'kin' ] = rel ;
			//					cl('prepare_data():: relations[ '+node_base+' ][ '+node_tek+' ][ '+ status +' ]  = '+rel ) ;
								// обрабатываю обратные отношения
								// если текущей записи нет в наборе отношений, то создаю 
								if ( relations[ node_tek ] == undefined ) { relations[ node_tek ] = {}; }
								relations[ node_tek ][ node_base ] = {} ;
								let temp = family_resp( rel, status, node_base ) ;
								relations[ node_tek ][ node_base ] = temp;
			//					cl('prepare_data()::relations[ '+node_tek+' ][ '+node_base+' ][ '+family_status( rel )+' ]  = ' + rel );
			//					cl('prepare_data():: temp: ', temp );
							/**/	
							}	
							
		
						}	
					}  
				}
			}
		}
		cl( 'prepare_data():: relations{}:', relations );

		
		//  выделение одной ветки из дерева
		//  это не исполняется!!!!!! а почему??????  Зачем это здесь???   ??????????????????????????????
		if ( sel_node > 0 ) {
			cl( 'prepare_data():: выделение одной ветки из дерева '+ sel_node +' !!! ' );
			alert( 'prepare_data():: выделение одной ветки из дерева '+ sel_node +' !!! ' );
		    let nl = 0;
	 		arc = arc.concat( nodes_0[sel_node].key ) ;  // заданная точка
			only.add( nodes_0[sel_node].key );
			cl( 'prepare_data:: only{}: ',  only );
		    nl = nodes_0.length;
			cl( 'prepare_data():: nodes_0{}: ', nodes_0 );
			for ( let i = sel_node; i < nl; ++i ) {
				cl( 'prepare_data():: otrezalka:: '+i+' :: '+nodes_0[i].key );
				if(  ( only.has( nodes_0[i].key ) ) && (  nodes_0[i].to )  ) {
					arc = arc.concat( nodes_0[i].to )  ;  // добавляю прямые потомки сразу группой
					let nl = nodes_0[i].to.length;
					cl('prepare_data()::'+ i+' *** '+nl );
					for ( let j = 0; j < nl ; ++j ) {
						cl( j+" / "+nl+" :: " + nodes_0[i].to[j] );
						only.add( nodes_0[i].to[j] );
						cl('prepare_data():: only: ', only );
					}
					cl( 'prepare_data():: arc{}: ',  arc );
					cl( 'prepare_data():: only{}: ', only );
					
				}
			}	// for ( let i = sel_node; i < nl; ++i )
//			cl( 'prepare_data():: arc{}: , arc );
			// фильтруем список прямых потомков на единственность и убираем undefined
		    nl = arc.length;
			for ( let i = 0; i < nl; ++i ) {
				 if( arc[i] ) { only.add( arc[i] ); } 
			}
			cl( 'prepare_data():: only{}: ', only );
			
			// оставляем в узлах только потомков
			nl = nodes_0.length;
			for ( let i = 0; i < nl; ++i ) {
				if (   only.has( nodes_0[i].key )  ) {
					nodes.push( nodes_0[i] ) ;  
				// 
				}
			}			
				cl( 'prepare_data():: new nodes{}: ', nodes );
/*		*/		
		} else {
			nodes = nodes_0;
		}
		
	   // собираем справочник по узлам - определение записи по key
	   // добавляем иденитификаторы строк
		nl = nodes.length;
		let kkey = "";
		let id_old = 0;
		let media;
//		cl('prepare_data():: txts{}: ', txts );
		for ( let i = 0; i < nl; ++i ) {
	//		cl('prepare_data():: nodes[ ' + i + ' ]: ', nodes[i] );
			id_old = nodes[i].id ;
			nodes[i].id =  i  ;  // "перенумерация" записей в соответствии порядковым номером строки
	//		cl( 'prepare_data():: meshalka:: '+i+' > '+nodes[i].key+' > '+nodes[i].to+'  !' ); cl( nodes[i] );
			kkey = nodes[i].key;
			slinks.set( kkey, i );
	//		cl( 'prepare_data()::  '+ i+' kkey: '+kkey );
			if( txts[kkey] ) {		// проверка наличия данных в txts для текщей записи
				nodes[i].label = ' '+txts[kkey].label+' ';	// расширяем описание узла
					media = get_media( txts[kkey].image ); 		// получаем объект media  
					//  ! нужен контроль наличия изображения перед присвоением
					//cl( 'media----------------' ); 	cl( media );
				if( media !=  undefined ){
					nodes[i].image = media.image_s ;	// получаем изображения из объекта media
				} else {
					nodes[i].image = 'img/000.jpg';
				}
			} else {
				alert ( 'Внимание!\n для записи [ '+kkey+' ] / id: '+id_old+' в sheme,\n отсутствуют данные в txts '  );
			}	
		}

		//   тестовая распечатка справочника
/*		slinks.forEach(function(value,key) {
		  console.log('slinks:: key = ' + key +', value = ' + value);
		});
 */		  cl( 'prepare_data():: slinks{}: ',  slinks );


		//  собираю таблицу связей  для отрисовки графа ?? набор отношения между элементами 
	    nl = nodes.length;
		let nn = 0 ;
		edges = [];
		cl ( 'собираю таблицу связей для графа - nodes.length: ' + nl )
		for ( let i = 0; i < nl; ++i ) {
			if( nodes[i].to ) {
				let k_to = nodes[i].key;
				let n_to = nodes[i].to;
				let ntl = n_to.length;	// длинна списка
				if ( n_to != 0 ) {  // если в списке есть информация
				// cl('prepare_data():: value::object ---------['+n_to+']'  );
					for ( let i = 0; i < ntl; ++i ) {
						let rel = '';
						if( n_to[i].indexOf( ':' ) !== -1 ) {
							[ n_to[i], rel ] =  n_to[i].split(':'); 
							cl( 'prepare_data():: edg{}: tron' );
						}	
						let edg = {};
						if( rel != '' ) {
							edg = {
								from: slinks.get(k_to),
								to: slinks.get( n_to[i] ),
								color: "#f00", // rgba(255,0,0,0.75),  / #ff0000
								background: {
									enabled: true,
									color: "#f00",
									size: 9,
								},
							//	size: 9,
							}
						} else {
							edg =  { 
								from: slinks.get(k_to),
								to: slinks.get( n_to[i] ),
							};
						}
							
						/*	background: { enabled: true, color: "rgba(255,0,0,0.75)",	size: 8,	}, */
						console.log ( 'prepare_data():: edg{}: ', edg );
						edges[nn] = edg ;
						nn++;
					}	
				}
			}	
		} 
/* */
		cl( 'prepare_data():: nodes{}: ', nodes );
		cl( 'prepare_data():: edges{}: ', edges );

/*	  cl('======================================== ');
		//   тестовая распечатка справочника
		edges.forEach(function(value,key) {
		  cl('prepare_data():: edges:: key = ' + key +', from = ' + value.from  +', to = ' + value.to );
		})
*/ 		cl( "---> function prepare_data () <---- end" );
	}
// --	function prepare_data ()	 ---- end
	

      /**
       * This function fills the DataSets. These DataSets will update the network.
       */
   function redrawAll(gephiJSON) {
        if (gephiJSON.nodes === undefined) {
          gephiJSON = gephiImported;
        } else {
          gephiImported = gephiJSON;
        }

        nodes.clear();
        edges.clear();

        var fixed = fixedCheckbox.checked;
        var parseColor = parseColorCheckbox.checked;

        var parsed = vis.parseGephiNetwork(gephiJSON, {
          fixed: fixed,
          parseColor: parseColor,
        });

        // add the parsed data to the DataSets.
        nodes.add(parsed.nodes);
        edges.add(parsed.edges);

        var data = nodes.get(2); // get the data from node 2 as example
        nodeContent.innerText = JSON.stringify(data, undefined, 3); // show the data in the div
        network.fit(); // zoom to fit
   }


// --------------------------- выше нормальная зона 	----------------------------------------------- //
// --------------------------- начало зоны проб и ошибок ---------------------------------------------- //
	// вывод в блок #showZone мультимедийного контента
	// параметры передаются объектом
	function out2showZone( cur ){
		cl( 'out2showZone: ' );
		cl( 'name: ' + cur.name );		// имя контента
		cl( 'group: ' + cur.group );	// группа/раздел контента
		cl( cur );
		let tt = '';
		let txt = '';

		$('#showZone').empty();			//  - очистить место для контента

		switch( cur.group ){
			case 'docs':
				tt = docs[ cur.name ];
				if ( tt.type == 'pdf' ){
					txt = 	decorate_one( 	// подстановка	
							tt,             // файла
							templs.out_pdf  // в шаблон
					);
				}	
			break;
			case 'video':
				tt = video[ cur.name ];
				cl(tt)
				switch( tt.type ){
					case 'youtube':
						cl('video youtube' );
						cl( tt );
						txt = decorate_one( 	// подстановка
							tt,	                // ролика
							templs.out_youtube	// в шаблон
						);
					break;	
					case 'rutube':
						cl('video rutube' );
						cl( tt );
			
						txt = decorate_one(   	// подстановка 
							tt,					// ролика
							templs.out_rutube	// в шаблон
						);			
					break;
					case 'VK':
						cl('video VK' );
						cl( tt );
			
						txt = decorate_one(   	// подстановка 
							tt,					// ролика
							templs.out_VK	// в шаблон
						);			
					break				}	
			break;
			default:
			cl( 'out2showZone: Ошибка определения контента для вывода! ' );
		}

		
		if ( txt != '' ) {
			cl( 'txt' );
			cl( txt );			
			$('#showZone').html( txt ).attr( 'group', cur.group).attr( 'type', tt.type);
			$('#showZ').addClass('show');			
		}
		
	}

	// объект Галлерея
	let Glr = {};
	Glr = {
		collection : {},
		slinks : {}, //  collection + порядковый номер вложения
		cur_collct : "",
		cur : 		"",
		
		sad: function(){
			cl('I SAD!');
		},

		add_series: function( name_series, prnt ){	// отключено по причине ошибки в логике - переделать полностью
	//		this.cur_collct = name ;
			cl( "Glr.add_series: вход " + name_series + " // " + prnt + "  ", series );
			if( name_series in series ) { 
				cl( "Glr.add_series: Галлерея " + name_series + " уже в коллекции / ", series );
			} else {
				cl( "Glr.add_series: Галлерея " + name_series + " на изучении" );
				series[ name_series ] = [] ;
				let im = $('#'+prnt+' img' ).each(
					function( index, img ){
						let i = $( img ).attr('id');
						series[ name_series ].push( i );
						cl( 'Glr.add_series: ' + index + ' : ' + i );
					}
				);
				cl( "Glr.add_series: Галлерея "+name_series+" добавлена в коллекцию / ", series );
			}
	},		
		add: function( name ){	// отключено по причине ошибки в логике - переделать полностью
	/*			this.cur_collct = name ;
			cl( "Glr.add: вход "+name+"  / ", this.collection );
			if( name in this.collection ) { 
				cl( "Glr.add: Галлерея "+name+" уже в коллекции / ", this.collection );
			} else {
				cl( "Glr.add: Галлерея "+name+" на изучении" );
				let glr = txts[ name ].glr ;
				this.collection[ name ] =  glr ;
				this.slinks[name] = {};
				for (let i in glr ) {
					cl( "Glr.add:  i = " + i , glr[ i ] );	//	cl( glr[ i ][0] );
					for (let ii in glr[ i ] ) {
						cl( 'Glr.add['+glr[ i ][ ii ] + ']: ' + ii  );
						if ( glr[ i ][ ii ] == 'collections'  ){
							cl('collections:: ' + ii );
							this.sad();
							this.add( ii );
						}else{
							this.slinks[name][ii] = {} ;
							this.slinks[name][ii]['order'] = i ;
							this.slinks[name][ii]['type'] = glr[ i ][ ii ] ;
						}
					};
				};
				cl( "Glr.add: Галлерея "+name+" добавлена в коллекцию / ", this.collection );
			}
*/	},
		
		show: function( cur  ){
		//	this.cur = cur ;	
			cl( "cur: "+cur+" типа: "+typeof( cur )) ;	
			
		},	
	};



// --------------------------- конец зоны проб и ошибок



/*
$(function(){  // Страница загружена!
	console.log('Готов!');
	$("#main").on('click',  function(){ 
		console.log('clck'); 
	});
});
*/