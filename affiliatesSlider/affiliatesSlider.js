const slider = document.getElementById("affiliatesSlider");
const slider_container = document.getElementById("affiliatesSlider_container");

// Settings define slider behavior.
const CONFIG_SLIDER = {
  num_show: 6, // Tndicates how many slides will be displayed.
  time: 3000, // Slider speed(ms).
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

// -------------------------------------------------------------------
// Utilities to manipulate the slider.
function Utilities(state){
  // Set the width of each item on the slider.
  this.setWidth = () => {
    let items_slide = document.querySelectorAll(".slide");
    let width_slider = slider.getBoundingClientRect().width;
    let width = width_slider / state.num_show;

    state.jump_space = width;

    Array.prototype.forEach.call(items_slide, (slide) => {
      slide.style.width = `${width}px`;
    })
  }

  /*
  Due to the operation of the slider, we have to clone a number of items,
  these functions respectively are in charge of handling this functionality.
  
    - cloneSlide: Clone the slides.
    - removeClones: Remove cloned items.
  */
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

  // Calculates slider skip or shift.
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

  // This method moves the slider.
  this.moveSlider = (jump) => {
    slider_container.style.transform = `translateX(${jump}px)`;
  }

  // Set the speed of slider transitions.
  this.setTransition = (indicator) => {
    if(indicator){
      slider_container.style.transition = "transform 2s";
    }else{
      slider_container.style.transition = "transform 0s";
    }
  }
}

// -------------------------------------------------------------------
// "setInterval" controls.
/*
This function is in charge of managing the start, stop and restart of
the interval, the function that is received as a parameter, the one
that will be executed in each interval.
*/
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

// -------------------------------------------------------------------
// This function is the main controller of the slider.
function ControllerSlider(){
  // Local state.
  const state = {
    margin: slider_container.getBoundingClientRect().x, // Design margin (window - slider).
    hop_counter: 0, // Hop counter.
    jump_space: 0, // Jump space.
    initNum_slide: slider_container.children.length, // Initial number of slide,
    num_show: CONFIG_SLIDER.num_show, // Tndicates how many slides will be displayed.
  }

  // Interval Driver Instances and Utility Driver Instances.
  const Utility = new Utilities(state);
  let Interval = new ControllerInterval(() => {
    this.controller()
  });

  // Start the slider.
  this.start = () => {
    this.responsive()
    Utility.cloneSlide();
    Interval.start();
  }

  // Reset the slider.
  this.reset = () => {
    state.hop_counter = 0;
    Utility.setTransition(false);
    Utility.moveSlider(0);

    slider_container.removeEventListener("transitionend", this.reset);
  }

  // Reboot the slider.
  this.reboot = () => {
    this.responsive();

    Utility.setTransition(false);

    Utility.removeClones();

    state.hop_counter = 0;
    Utility.moveSlider(0);
    
    state.margin = slider_container.getBoundingClientRect().x;
    Utility.cloneSlide(); 

    Interval = Interval.reset();
  }

  // Principal function.
  this.controller = () => {
    Utility.setTransition(true);

    let jump = Utility.calculateJump();
    Utility.moveSlider(jump);

    state.hop_counter += 1;

    if(state.hop_counter == state.initNum_slide){
      // When the transaction finished, the restart function is executed.
      slider_container.addEventListener("transitionend", this.reset);
    }
  }

  // Indicates the number of slides to be displayed, it is used in the answer.
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
}

// IIFE is used to keep the slider instance in a closed scope.
(() => {
  const AffiliatesSlider = new ControllerSlider();
  let last_width = document.getElementsByTagName("body")[0].getBoundingClientRect().width;

  // Start the slider.
  AffiliatesSlider.start();

  // Used by resize event to calculate slider views.
  window.addEventListener("resize", () => {
    let { width } = document.getElementsByTagName("body")[0].getBoundingClientRect().width;

    if(width !== last_width){
      AffiliatesSlider.reboot();
      last_width = width;
    }
  })
})()