const slider = document.getElementById("affiliatesSlider");
const slider_container = document.getElementById("affiliatesSlider_container");

const CONFIG_SLIDER = {
  num_show: 6,
  time: 2000,
  breakingPoints: [
    {
      size: 768,
      num_show: 4,
    },
    {
      size: 425,
      num_show: 3,
    }
  ]
}

function Utilities(state){
  this.setWidth = () => {
    let items_slide = document.querySelectorAll(".slide");
    let width_slider = slider.getBoundingClientRect().width;
    let width = width_slider / state.num_show;

    state.jump_space = width;

    Array.prototype.forEach.call(items_slide, (slide) => {
      slide.style.width = `${width}px`;
    })
  }

  this.cloneSlide = () => {
    let items_slide = document.querySelectorAll(".slide");

    for (let i = 0; i < state.num_show; i++) {
      let slide = items_slide[i];
      let clon_slide = slide.cloneNode(true);
      slider_container.appendChild(clon_slide);   
    }

    this.setWidth();
  }

  this.removeClones = () => {
    let items_slide = document.querySelectorAll(".slide");

    for (let i = state.initNum_slide; i < items_slide.length; i++) {
      items_slide[i].parentNode.removeChild(items_slide[i]); 
    }
  }

  this.calculateJump = () => {
    let position_slider = slider_container.getBoundingClientRect().x;  
    let offset_size = position_slider;

    if(offset_size < 0) offset_size *= -1;
    if(offset_size != state.margin){
      position_slider = 0;
      offset_size += state.margin;
    };

    return position_slider - (offset_size + state.jump_space);
  }

  this.moveSlider = (jump) => {
    slider_container.style.transform = `translateX(${jump}px)`;
  }

  this.setTransition = (indicator) => {
    if(indicator){
      slider_container.style.transition = "transform 1s";
    }else{
      slider_container.style.transition = "transform 0s";
    }
  }
}

function ControllerInterval(fn){
  let timer = null;

  this.stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    return this;
  }

  this.start = () => {
    if (!timer) {
      this.stop();
      timer = setInterval(fn, CONFIG_SLIDER.time);
    }
      return this;
  }

  this.reset = () => {
    return this.stop().start();
  }
}

function ControllerSlider(){
  const state = {
    margin: slider_container.getBoundingClientRect().x, // Design margin (window - slider)
    hop_counter: 0, // Hop counter
    jump_space: 0, // Jump space
    initNum_slide: slider_container.children.length, // Initial number of slide,
    num_show: CONFIG_SLIDER.num_show
  }

  const Utility = new Utilities(state);

  let Interval = new ControllerInterval(() => {
    this.controller()
  });

  this.start = () => {
    this.responsive()
    Utility.cloneSlide();
    Interval.start();
  }

  this.reset = () => {
    state.hop_counter = 0;
    Utility.setTransition(false);
    Utility.moveSlider(0);

    slider_container.removeEventListener("transitionend", this.reset)
  }

  this.reboot = () => {
    this.responsive()

    Utility.setTransition(false);

    Utility.removeClones();

    state.hop_counter = 0;
    Utility.moveSlider(0);
    
    state.margin = slider_container.getBoundingClientRect().x;
    Utility.cloneSlide(); 

    Interval = Interval.reset();
  }

  this.controller = () => {
    Utility.setTransition(true);

    let jump = Utility.calculateJump();
    Utility.moveSlider(jump);

    state.hop_counter += 1;

    if(state.hop_counter == state.initNum_slide){
      slider_container.addEventListener("transitionend", this.reset)
    }
  }

  this.responsive = () => {
    let { width } = document.getElementsByTagName("body")[0].getBoundingClientRect();
    let val = CONFIG_SLIDER.num_show;

    if(width <= 560){
      val = 3;
    }else if(width <= 768){
      val = 4;
    }else if(width <= 1024){
      val = 5;
    }

    state.num_show = val;
  }

  this.test = () => {
    Utility.cloneSlide();
    Utility.removeClones();
  }
}

(() => {
  const AffiliatesSlider = new ControllerSlider();

  window.addEventListener("load", () => {
    AffiliatesSlider.start();
  })
  window.addEventListener("resize", () => {
    AffiliatesSlider.reboot(3);
  })
})()