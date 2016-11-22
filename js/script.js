$(function()
{
	var preguntas 		= [],
		ordePreguntas 	= [],
		correcta 		= 0,
		numPregunta 	= 0,
		tiempo 			= 0,
		cuentaTiempo 	= 0,
		numCorrecta		= 0,
		totalPreguntas	= 0,
		presionaOpcion	= false;

	var cargarJson = function()
	{
		$.getJSON( "js/preguntas.json", function(data)
		{
			preguntas = data;
			totalPreguntas = data.length;
			darOrdenPreguntas();
			eventosOpciones();
			cargarPregunta();
		});
	}();

	var eventosOpciones = function()
	{
		for(var i = 1; i <= 4; i++)
		{
			$("#opcion_" + i).click(function(event)
			{
				if(!presionaOpcion)
				{
					validaRespuesta(Number(this.id.split("_")[1]));
					presionaOpcion = true;
				}
			});
		}
	};

	var darOrdenPreguntas = function()
	{
		var aleatorio = 0,
			existe = false,
			contador = 0;
		do
		{
			existe = false;
			aleatorio = Math.floor(Math.random() * preguntas.length);
			for(var i = 0; i < ordePreguntas.length; i++)
			{
				if(ordePreguntas[i] === aleatorio)
				{
					existe = true;
					break;
				}
			}
			if(!existe)
			{
				ordePreguntas.push(aleatorio);
				contador++;
				if(ordePreguntas.length === preguntas.length)
				{
					break;
				}
			}
		}while(1);
	};

	//Para cargar la pregunta...
	var cargarPregunta = function()
	{
		var miPregunta = preguntas[ordePreguntas[numPregunta]];
		$("#titulo").html("Pregunta Nº " + (numPregunta + 1));
		$("#pregunta").html(miPregunta.pregunta);
		//Guarda la respuesta correcta...
		correcta = miPregunta.correcta;
		cuentaTiempo = 60;
		//Para el tiempo...
		tiempo = setInterval(function()
		{
			cuentaTiempo--;
			$("#tiempo").html((cuentaTiempo <= 9 ? "0" + cuentaTiempo : cuentaTiempo) + "'");
			if(cuentaTiempo <= 0)
			{
				validaRespuesta(0);
			}
		}, 1000);
		//Para cargar las opciones de respuesta...
		for(var i = 1; i <= miPregunta.opciones.length; i++)
		{
			$("#opcion_" + i).html(miPregunta.opciones[i - 1])
							 .hide()
							 .delay(i * 100)
							 .fadeIn('slow')
							 .removeClass("correcto incorrecto");
		}
	};

	var validaRespuesta = function(respuesta)
	{
		$("#tiempo").html("60'");
		clearInterval(tiempo);
		var correcto = true;
		if(respuesta === correcta)
		{
			$("#opcion_" + respuesta).addClass('correcto');
			numCorrecta++;
		}
		else
		{
			$("#opcion_" + correcta).addClass('correcto');
			if(respuesta !== 0)
			{
				$("#opcion_" + respuesta).addClass('incorrecto');
			}
			correcto = false;
		}
		$("#mensaje").html(correcto ? "CORRECTO :)" : "INCORRECTO :(")
					 .css({color: correcto ? "#73BF43" : "#EB1C24"})
					 .show('fast')
					 .delay(2000)
					 .hide('fast', function()
					 {
					 	numPregunta++;
					 	if(numPregunta < totalPreguntas)
					 	{
							presionaOpcion = false;
					 		cargarPregunta();
					 	}
					 	else
					 	{
							var porcentaje  = Math.round((numCorrecta / totalPreguntas) * 100),
								tipoMuestra	= porcentaje >= 50 ? "success" : "error";
					 		swal(
					 		{
					 			title: porcentaje  + "%",
					 			text: "Has contestado correctamente " + numCorrecta + " preguntas de " + totalPreguntas,
					 			showCancelButton: false,
					 			confirmButtonColor: "#DD6B55",
					 			confirmButtonText: "Aceptar",
					 			closeOnConfirm: false,
					 			type: tipoMuestra,
					 		},
					 		function()
					 		{
					 			swal({
										title: "Cargando...",
										text: "Reiniciando Juego",
										timer: 500,
										showConfirmButton: false,
										type: "info",
									});
					 			location.reload();
					 		});
					 	}
					});
	};
});
