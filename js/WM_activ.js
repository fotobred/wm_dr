	// *** ---------- блок назначения реакций --------------------------начало---- *** 
	function activities(){
		//301 переход на точку - родственника
		$("#main").on('click', '.relative', function(params){ 
			let t = $(this);
			cl('301 clck child goto_next2:'+ ' ' + t.attr('data_id')   );
			goto_node( t.attr('data_id') );
		});	  

		//302 переход на точку - предок - clck parent 
		$("#image_top").on('click', "figure.image figcaption", function(params){ 
			console.log('302 clck parent goto_next2:'+ gc() + ' ' + this.id   );
			goto_next2(params);
		});	

		//303 переход на точку из галереи - clck parent 
/*		$("#image_top").on('click', "figure.image figcaption", function(params){ 
			console.log('clck parent goto_next2:'+ gc() + ' ' + this.id   );
			goto_next2(params);
		});
*/

		//304 показ картинки во весь экран - clck show_image  // #main img
		$(".gallery").on('click', ".show_pict", function(params){ 
			let t = $(this);
			let prnt = t.closest('.gallery').attr('id') ;
			let name_series = t.closest('.gallery').attr('name') ;
			
			cl('304 clck show_image: '+t.attr("data_id")+' parent.name_series: '+name_series+':'+prnt+' type: '+t.attr("type") );

		//	Glr.add_series( t.attr("data_id") );
			Glr.add_series( name_series, prnt );
			show_image( t.attr("data_id"), name_series );
			params.stopPropagation();
		});

		//305  смена картинки во весь экран
		$("#show_image #right, #show_image #left").on('click', function(params){ 
			let t = $(this);
			cl('305 clck show_image:'+t.attr("id")+' / '+ t.attr("slot")+' / '+ t.attr("name") );
			show_image( t.attr("slot"), t.attr("name") );
		});

		//307  закрытие картинки во весь экран -  клик по кресту
		$("#show_image .close, #show_image img").on('click', function(params){ 
			cl('307 clck close show_image' );
			$("#show_image").removeClass( 'show' );
		});
		
	/*	//308  закрытие картинки во весь экран - клик по картинке
		$("#show_image img").on('click', function(params){ 
			console.log('308 clck close show_image'+ gc()   );
			$("#show_image").removeClass( 'show' );
		});

		//309 картинка во весь экран - клик по подписи
		$("#show_image figcaption").on('click', function(params){ 
			console.log('309 clck figcaption big_show_image: '+  this.id   );
				if ( this.id ) {
				$("#show_image").removeClass( 'show' );
			} 
		}); */
		
		//310 переключатель вида разделения рабочей зоны
		$("#vh").click( function (params) {
 		cl('310 clck vh:'+ gc() + ' ' + ' params ' + params )
		if( $("#work_zone").hasClass("grznt") ) {
			$("#work_zone").removeClass("grznt")
			$("#vh").html("—")
			clear_style();
			$("#work_zone").addClass("vert")
		} else {	
			$("#work_zone").removeClass("vert")
			$("#vh").html("|")
			clear_style();
			$("#work_zone").addClass("grznt")
		}
			//goto_next(params);
		})

		//311
		$("#re_data").click( function () {
			o_layout.hierarchical.enabled = on_off ( o_layout.hierarchical.enabled, true, false ) ;
			console.log('311 clck re_data:'+ gc() + ' ' + o_layout.hierarchical.enabled ) ;
			draw() ;
		})

		//312
		$("#image_box").click( function () {
			o_nodes.shape = on_off ( o_nodes.shape, 'image', 'box' ) ;
			console.log('312 clck image_box:'+ gc() + ' ' + o_nodes.shape ) ;
			draw() ;
		})

		//313	клик по имени персоны для обнавления графа
		$("#main #title").click( function (params) {
			sel_node = $("#main #title").attr("sel_node") ;
			console.log('313 clck #main #title:'+ gc() + ' '  + ' sel_node: ' + sel_node ) ;
			draw() ;
		})

		//314  ??????????????????
		$("#main hr").click( function (params) {
			sel_node = 0 ;
			draw() ;
		})

		//315   показ doc  в  showZone
		$("#work_zone").on( "click", ".docs", function (params) {
			console.log('315 clck .docs' ) ;
			out2showZone( 
				{
					name: $( ".docs a" ).attr( 'name' ),
					group: $( ".docs a" ).attr( 'group' )
				}				
			);
			$("#showZ").css("display", "block");
			params.stopPropagation();
		})
		
		//316  закрытие Show Зоны -  клик по кресту
		$("#cllcZo .close, #showZo .close").on('click', function(params){ 
			cl('316 '+ gc() + ' clck close  .close '  );
			// если загружено видео - вычищаю проигрыватель
			if ($('iframe').length) {  
				$('#showZone').empty();	
			}
			$( this ).parents('.prnt_close').removeClass( 'show' );
		});
/**/
		//317  -- старт video  из персональной информации ( левый раздел )
		$("#textwork #main").on( 'click', ".video", function (params) {
			cl('317 '+ gc() + ' clck .video', this ) ;
			out2showZone( 
				{
//					group: $( this ).attr( 'type' ),
//					name: $( this  ).attr( 'label' )
					group: $( this ).children( 'a' ).attr( 'group' ),
					name: $( this  ).children( 'a' ).attr( 'name' )
				}				
			);
			$("#showZ").css("display", "block");
			params.stopPropagation();
		});

		//317 -- старт video  из галлереи ( правый раздел )
		$("#textwork #gallery").on( 'click', ".video", function (params) {
			cl('317 '+ gc() + ' clck .video', this ) ;
			out2showZone( 
				{
					group: $( this ).attr( 'type' ),
					name: $( this  ).attr( 'label' )
//					group: $( this ).children( 'a' ).attr( 'group' ),
//					name: $( this  ).children( 'a' ).attr( 'name' )
				}				
			);
			$("#showZ").css("display", "block");
			params.stopPropagation();
		});
		

		
		//318 -- старт video  из коллекции
		$("#cllcZone, #showZone").on( 'click', ".video", function (params) {
			cl('318 '+ gc() + ' clck .video', this ) ;
			out2showZone( 
				{
					group: $( this ).attr( 'type' ),
					name: $( this ).attr( 'data_id' )
				}				
			);
			$("#showZ").css("display", "block");
			params.stopPropagation();
		});

		//319 показ коллекции
		$("#gallery").on('click', ".show_collection", function(params){ 
			let t = $(this);
			let node = t.attr("data_id");

			cl('319 '+ gc() + ' clck show_collection: '+node+' type: '+t.attr("type")  );

			put_glr_picts( collections[ node ].glr, '#cllcZone' );

			$('#cllcZone').prepend( '<h4>'+ collections[ node ].txt +'</h4>');
			$('#cllcZone').prepend( '<h3>'+ collections[ node ].title +'</h3>');
			$('#cllcZone').attr( 'group', 'collection' );
			$('#cllcZone').attr('name', node ); // подпись для галлереи
			$("#cllcZ").css("display", "block");

/*	*/
	
		});		
		
	}
	// *** ---------- блок назначения реакций --------------------------конец---- *** 