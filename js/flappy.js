/* Função que adiciona um novo elemento apartir do nome da tag e da classe*/
function novoElemento(tagName, className){
  /*constante que recebe o elemetno nome da tag e retorna */
  const elem = document.createElement(tagName)
  elem.className = className
  return elem
} 


/*  Função que cria a barreira
Barreira reversa = corp que vem por primeiro depois a borda*/
function Barreira(reversa = false) {
  this.elemento = novoElemento('div', 'barreira')
  /*Verifica qual vai ser adionado por primeiro 
  Se For true =  corpo e borda
  Se for Falso =  borda e corpo*/
  const borda = novoElemento('div', 'borda')
  const corpo = novoElemento('div', 'corpo')
  this.elemento.appendChild(reversa ? corpo : borda)
  this.elemento.appendChild(reversa ? borda : corpo)

  /*função que altera a altura das barreiras*/ 
  this.setAltura = altura => corpo.style.height = `${altura}px`
}

//const b = new Barreira(true)
//b.setAltura(200)
//document.querySelector('[tela-jogo]').appendChild(b.elemento)

function ParDeBarreiras(altura, abertura, x){
  this.elemento = novoElemento('div', 'par-de-barreiras')

  this.superior = new Barreira(true)
  this.inferior = new Barreira(false)

  this.elemento.appendChild(this.superior.elemento)
  this.elemento.appendChild(this.inferior.elemento)

  // metodo que executa o sorteio do tamanho das barreiras
  this.sortearAbertura = () => {
     const alturaSuperior = Math.random() * (altura-abertura)
     const alturaInferior = altura - abertura - alturaSuperior
     this.superior.setAltura(alturaSuperior)
     this.inferior.setAltura(alturaInferior)
  }

// metodo que foi escolhido para pegar o valor retornado e setar denovo 
this.getX = () => parseInt(this.elemento.style.left.split('px'[0]))
this.setX = x => this.elemento.style.left = `${x}px`
//pega a largudo objeto
this.getLargura = () => this.elemento.clientWidth
this.sortearAbertura()
this.setX(x)

}

//const b = new ParDeBarreiras(700, 200, 400)
//seleciona a Area do jogo
//document.querySelector('[tela-jogo]').appendChild(b.elemento)


function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3)
  ]

    const deslocamento = 4
    //função que faz executar passar por pares de barreiras fazendo o deslocamento
    this.animar = () => {
      this.pares.forEach(par => {
        par.setX(par.getX() - deslocamento)

        // quando o elemento sair da area do jogo, pega as barreiras pra jogar devolta na tela
        // momento que o elemento saiu da tela
        if(par.getX() < -par.getLargura()) {
          par.setX(par.getX() + espaco * this.pares.length)
          // para fazer barreias diferentes precisa sortealas novamente
          par.sortearAbertura()
        }


        // função que valida se o objeto cruzou o meio 
        const meio = largura / 2 
        const cruzouOMeio = par.getX() + deslocamento >= meio
        && par.getX() < meio 
        // se cruzar o meio conta ponto 
        // se não cruzou o meio não conta ponto
        if(cruzouOMeio) notificarPonto()
      })
    }
    if(Progresso.pontos = 4){
      deslocamento + 4
    }
  }
  
  

  function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}
    
  

  // altura = 700 , abertura = 1200 , largura = 200, espaço = 400
  //const barreiras = new Barreiras(700, 1200, 200, 400)
  //const areaDoJogo = document.querySelector('[tela-jogo]')
 // const passaro = new Passaro(700)

//areaDoJogo.appendChild(passaro.elemento)
 // barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
  // define o tempo que irá passar cada barreira
 // setInterval(()=>{
//barreiras.animar()
 //   passaro.animar()
 // }, 20)

 //contador de pontos
 function Progresso() {
  this.elemento = novoElemento('span', 'progresso')
  this.atualizarPontos = pontos => {
      this.elemento.innerHTML = pontos
  }

}





function estaoSobrepostos(elementoA, elementoB) {
  //pegar o retangulo do elemento  para saber se estão sobrepondo o elemento
  const a = elementoA.getBoundingClientRect()
  const b = elementoB.getBoundingClientRect()

  // os teste de sobreposição para ver se colediu
  // colisão horizontal
  const horizontal = a.left + a.width >= b.left
      && b.left + b.width >= a.left
  // colisao vertical    
  const vertical = a.top + a.height >= b.top
      && b.top + b.height >= a.top
  return horizontal && vertical
}


function colidiu(passaro, barreiras) {
  let colidiu = false
  barreiras.pares.forEach(parDeBarreiras => {
      if (!colidiu) {
          const superior = parDeBarreiras.superior.elemento
          const inferior = parDeBarreiras.inferior.elemento
          colidiu = estaoSobrepostos(passaro.elemento, superior)
              || estaoSobrepostos(passaro.elemento, inferior)
      }
  })
  return colidiu
}

function FlappyBird() {
  let pontos = 0

  const areaDoJogo = document.querySelector('[tela-jogo]')
  const altura = areaDoJogo.clientHeight
  const largura = areaDoJogo.clientWidth

  // atualiza os pontos
  const progresso = new Progresso()
  const barreiras = new Barreiras(altura, largura, 200, 400,
      () => progresso.atualizarPontos(++pontos))
  const passaro = new Passaro(altura)

  areaDoJogo.appendChild(progresso.elemento)
  areaDoJogo.appendChild(passaro.elemento)
  barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

  this.start = () => {
      // loop do jogo
      const temporizador = setInterval(() => {
          barreiras.animar()
          passaro.animar()

          if (colidiu(passaro, barreiras)) {
              clearInterval(temporizador)
          }
      }, 20)
  }
}

new FlappyBird().start()

