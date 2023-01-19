/** Canvas settings.
     * @name Canvas
     * @property {number} width horizontal width of canvas in pixels
     * @property {number} height vertical height of canvas in pixels
     * @property {object} context '2D' canvas rendering context
     * @property {boolean} center_canvas centers the canvas in the window
     * @property {boolean} flex_canvas dynamically resizes the canvas to fill the entire window
     * @property {function} draw user defined function that is called every frame, with one optional time parameter corresponding to animation's relative time evolution
     */

/** Animation settings
     * @name Animation
     * @property {boolean} start_animation starts animation evolution when animate() is called
     * @property {boolean} loop_animation loops the animation over the animation evolution time range
     * @property {number} t_start start time of animation interval
     * @property {number} t_end end time of animation interval
     * @property {number} fps number of frames-per-second
     * @property {string} animation_mode the animation mode to be used: 'rate', 'frames' 'time'
     * @property {number} animation_rate amount of time incremented each frame of animation
     * @property {number} animation_frames how many total frames the animation will evolve
     * @property {number} animation_time absolute time of animation evolution
     */

 /**Interaction settings
     * @name Interaction
     * @property {function} interaction user specified function that is called every frame when interaction is enabled
     * @property {boolean} interaction_enabled enables interaction on the canvas if true
     * @property {string | string[]} interaction_modes  valid interaction modes are 'mousedownmove', 'mousehovermove', 'touchmove', 'scroll'. Input parameter must be a single string, or an array of valid interaction modes
     * @property {number[]} interaction_origin array of two numbers specifying the horizontal/vertical components of the interaction origin point
     * @property {number} scroll_width size of horizontal scroll in pixels
     * @property {number} scroll_height size of vertical scroll in pixels
     * 
     * @property {number} mouseX horizontal x-coordinate in pixels
     * @property {number} mouseY vertical y-component in pixels
     * 
     * @property {number} mouseX1 horizontal x-component in unit normalized range
     * @property {number} mouseY1 vertical y-component in unit normalized range
     * 
     * @property {number} scrollX horizontal x-component of scroll range in pixels
     * @property {number} scrollY vertical y-component of scroll range in pixels
     * 
     * @property {number} scrollX1  horizontal x-component of scroll range in unit normalized range
     * @property {number} scrollY1 vertical y-component of scroll range in unit normalized range
     * @property {boolean} pressedMouse true when mouse is pressed down
     * @property {boolean} pressedTouch true when touch is pressed down
     * @property {boolean} pressed true when mouse or touch is pressed down
     */

/** Recording settings
     * @name Recording
     * @property {boolean} record_enabled enables recording if true
     * @property {number} record_max_frames number of maximum recording frames
     * @property {number} record_loops number of animation loops to record
     * @property {boolean} pre_loop allows one full animation loop to complete before recording starts if true
     * @property {string} filename name prefix given to recorded frames, where each frame's name is indexed as 'filename_{frame_number}'
     * 
     */

/**Dwitter settings
     * @name Dwitter
     * @property {boolean} dwitter_mode creates a namespace to interpret code conventions using short function definitions from Dwitter if true
     * @property {boolean} dwitter_res sets the canvas dimensions to 1920x1080 as used on Dwitter if true
     * @property {boolean} dwitter_scale rescales the canvas to user specified dimensions if true
     * @property {string} dwitter_code Dwitter code as a string literal
     */

const default_settings = {

        // canvas settings
        center_canvas : false,
        flex_canvas : false,
        canvas_margin : "-8px",

        // Evolver settings
        start_animation : true,
        loop_animation : false,
        t_start : 0,
        t_end : undefined,

        // animation settings
        fps: 50,
        animation_mode : "rate", 
        animation_rate : 0.01,
        animation_frames : undefined,
        animation_time : 3,

        // interaction settings
        interaction_enabled : false,
        interaction_modes : ['mousedownmove', 'touchmove'],
        interaction_origin : [0.0, 0.0],
        scroll_width : 2000,
        scroll_height : 2000,

        // recording settings
        record_enabled : false,
        record_max_frames : 1000,
        record_loops : 1,
        pre_loop : false,
        filename : 'frame_',

        // dwitter settings
        dwitter_mode : false,
        dwitter_res : false,
        dwitter_scale : false,
        dwitter_code : undefined
    }


function canvasIDcheck(canvas_id) {
    try {
        let target_element = document.getElementById(canvas_id);
        if (target_element == undefined) {
            if ( !(canvas_id == undefined) && typeof canvas_id != "string" || canvas_id == '') {
                let msg = "Input to 'CanvasAnimater()' must be a nonempty string corresponding to the 'id' of an existing 'CANVAS' DOM element;  or 'undefined' to add a new 'CANVAS' element to the DOM.";
                throw msg
            }
            let canvas_element = document.createElement('canvas');
            canvas_element.id = canvas_id;
            document.body.appendChild(canvas_element);
            //return new CanvasAnimater(canvas_id);
        }
        else if (target_element.nodeName != 'CANVAS') {
            console.log(`DOM element with id=${canvas_id} is not of type <canvas>`);
        }
        else {
            //return new CanvasAnimater(canvas_id);
        }
    }
    catch(msg) {
        console.error(msg);
        alert(msg);
    }
}

/** A class that animates a canvas with parameterized time evolution, interactivity, and recording.
     * @param {string}  canvas_id canvas DOM element's HTML 'id' attribute
     */
class CanvasAnimater {

    constructor(canvas_id) {
        canvasIDcheck(canvas_id);
        this.animater = new Animater(canvas_id);
        this.settings = this.animater.animation_settings;
    }

    set settings(settings_object) {
        this.setAnimater(settings_object);
    }

    get context() {
        return this.animater.canvas.context;
    }

    set draw(function_definition) {
        this.animater.draw = function_definition;
    }

    get width() {
        return this.animater.width;
    }
    set width(width) {
        this.setAnimater({width : width});
    }

    get height() {
        return this.animater.height;
    }
    set height(height) {
        this.setAnimater({height : height});
    }

    set flex_canvas(flex_canvas) {
        this.flex(flex_canvas);
    }

    set center_canvas(center_canvas) {
        this.center(center_canvas);
    }

    set start_animation(start_animation) {
        this.setAnimater({start_animation : start_animation});
    }

    set loop_animation(loop_animation) {
        this.loop(loop_animation);
    }

    set t_start(t_start) {
        this.setAnimater({t_start : t_start});
    }

    set t_end(t_end) {
        this.setAnimater({t_end : t_end});
    }

    set fps(fps) {
        this.setAnimater({fps : fps});
    }

    set animation_mode(animation_mode) {
        this.setAnimater({animation_mode : animation_mode});
    }

    set animation_rate(animation_rate) {
        this.setAnimater({animation_rate : animation_rate});
    }

    set animation_frames(animation_frames) {
        this.setAnimater({animation_frames : animation_frames});
    }

    set animation_time(animation_time) {
        this.setAnimater({animation_time : animation_time});
    }

    set dwitter_mode(dwitter_mode) {
        this.setAnimater({dwitter_mode : dwitter_mode});
    }

    set dwitter_res(dwitter_res) {
        this.setAnimater({dwitter_res : dwitter_res});
    }

    set dwitter_scale(dwitter_scale) {
        this.setAnimater({dwitter_scale : dwitter_scale});
    }

    set dwitter_code(code_string) {
        this.animater.dwitterCode_string = code_string;
        this.animater.dwitterCode_set = true;
        this.setAnimater({dwitter_mode : true});
    }

    set record_enabled(record_enabled) {
        this.setAnimater({record_enabled : record_enabled});
    }

    set record_max_frames(record_max_frames) {
        this.setAnimater({record_max_frames : record_max_frames});
    }

    set record_loops(record_loops) {
        this.setAnimater({record_loops : record_loops});
    }

    set pre_loop(pre_loop) {
        this.setAnimater({pre_loop : pre_loop});
    }

    set filename(filename) {
        this.setAnimater({filename : filename});
    }
   
    set interaction(function_definition) {
        this.animater.interaction = function_definition;
    }

    set interaction_enabled(interaction_enabled) {
        this.setAnimater({interaction_enabled : interaction_enabled});
    }
    
    set interaction_modes(interaction_modes) {
        this.setAnimater({interaction_modes : interaction_modes});
    }

    set interaction_origin(interaction_origin) {
        this.setAnimater({interaction_origin : interaction_origin});
    }

    set scroll_width(scroll_width) {
        this.setAnimater({scroll_width : scroll_width});
    }

    set scroll_height(scroll_height) {
        this.setAnimater({scroll_height : scroll_height});
    }

    get mouseX() {
        return this.animater.interacter.canvas_x;
    }
    get mouseY() {
        return this.animater.interacter.canvas_y;
    }

    get mouseX1() {
        return this.animater.interacter.norm_x;
    }
    get mouseY1() {
        return this.animater.interacter.norm_y;
    }

    get scrollX() {
        return this.animater.interacter.scroll_x;
    }
    get scrollY() {
        return this.animater.interacter.scroll_y;
    }

    get scrollX1() {
        return this.animater.interacter.scroll_norm_x;
    }
    get scrollY1() {
        return this.animater.interacter.scroll_norm_y;
    }

    get pressedMouse() {
        return this.animater.interacter.mouse_pressed;
    }

    get pressedTouch() {
        return this.animater.interacter.touch_pressed;
    }

    get pressed() {
        return this.animater.interacter.mouse_pressed || this.animater.interacter.touch_pressed;
    }

    /** Configures animation settings with an object containing any number of defined CanvasAnimater settings.
     * @param {object} settings_object object with key/value pairs of CanvasAnimater settings
     */
    setAnimater(settings_object) {
        this.animater.setAnimater(settings_object);
    }

    /** Prints an object of configured animation settings to the console.
     */
    printSettings() {
        console.log(this.animater.animation_settings);
    }

    /** Sets how many frame-per-second the animation is rendered at.
     * @param {number} fps number of frames-per-second
     */
    FPS(fps) {
        this.setAnimater({fps : fps});
    }

    /** Sets the width and height dimensions of the canvas.
     * @param {number} width horizontal width of the canvas in pixels.
     * @param {number} height vertical height of the canvas in pixels.
     */
    size(width, height = width) {
        this.setAnimater({width : width, height : height});
    }

    /** Centers the canvas in the window.
     * @param {boolean} center_canvas canvas is centered if true
     */
    center(center_canvas = true) {
        this.setAnimater({center_canvas : center_canvas});
    }

    /** Dynamically resizes the width and height of the canvas to fill the entire window.
     * @param {boolean} flex_canvas canvas is flexed if true
     */
    flex(flex_canvas = true) {
        this.setAnimater({flex_canvas : flex_canvas});
    }

    /** Creates a namespace to interpret code conventions using short function definitions from Dwitter.com. 
     * @param {boolean} dwitter_mode enables Dwitter mode if true
     * @param {boolean} dwitter_scale rescales the canvas to user specified dimensions by transforming the canvas context.
     * @param {boolean} dwitter_res sets the canvas dimensions to 1920x1080 as used on Dwitter if true
     */
    dwitterMode(dwitter_mode = true, dwitter_scale = false, dwitter_res = false) {
        this.setAnimater({dwitter_mode : dwitter_mode, dwitter_scale : dwitter_scale, dwitter_res : dwitter_res});
    }

    /** Specifies which interaction modes are enabled for the canvas. 
     * @param {(string|string[])} interaction_modes input parameter must be a single string, or an array of valid interaction modes: 'mousedownmove', 'mousehovermove', 'touchmove', 'scroll'. 
     * @param {bollean} interaction_enabled enables interaction on the canvas if true
     */
    interact(interaction_modes, interaction_enabled = true) {
        this.setAnimater({interaction_enabled : interaction_enabled, interaction_modes : interaction_modes});
    }

    /** Sets the relative coordinates for the origin point for which various interaction parameters are defined.
     * @param {number} x0 horixontal x-component of the origin point
     * @param {number} y0 vertical y-component of the origin point
     */
    interactionOrigin(x0 = 0.0, y0 = 0.0) {
        this.setAnimater({interaction_origin : [x0, y0]});
    }

    /** Sets the width (horizontal) and height(vertical) components of a canvas wrapper to enable scrolling parameters for canvas interaction when 'scroll' interaction is enabled.
     * @param {number} width size of horizontal scroll in pixels
     * @param {number} height size of vertical scroll in pixels
     */
    scrollSize(width = 2000, height = 2000) {
        this.setAnimater({scroll_width : width, scroll_height : height});
    }

    /** Sets which animation mode should be used. Possible types are 'rate', ' frames', 'time'. Additional optional parameters set values to various settings depending on which animation mode is used.
     * 
     * 'animation_rate' is the amount of time incremented each frame of animation.
     * 
     * 'animation_frames' is how many total frames the animation will evolve.
     * 
     * 'animation_time' is the absolute time of animation evolution.
     * @param {string} animation_mode valid strings are 'rate', 'frames', 'time'
     * @param {number} p0 If animation_mode='rate', then p0= 'animation_rate'. If animation_mode='frames', then p0= 'animation_frames'. If animation_mode='time', then p0= 'animation_time'.  
     * @param {number} p1 If animation_mode='rate', then p1=undefined. If animation_mode='frames', then p1= 'animation_rate'. If animation_mode='time', then p0= 'animation_rate'. 
     */
    mode(animation_mode, p0, p1 = undefined) {
        let settings = {animation_mode : animation_mode};
        if (animation_mode == 'rate') {
            if (!(p0 == null)) {
                settings['animation_rate'] = p0;
            }
        }
        if (animation_mode == 'frames') {
            if (!(p0 == null)) {
                settings['animation_frames'] = p0;
            }
            if (!(p1 == null)) {
                settings['animation_rate'] = p1;
            }
        }
        if (animation_mode == 'time') {
            if (!(p0 == null)) {
                settings['animation_time'] = p0;
            }
            if (!(p1 == null)) {
                settings['animation_rate'] = p1;
            }
        }
        this.setAnimater(settings);
    }

    /** Sets a time interval through which the animation will evolve.
     * 
     * @param {number} t_start start time of animation interval
     * @param {number} t_end end time of animation interval
     */
    evolve(t_start = this.animater.animation_settings.t_start, t_end = this.animater.animation_settings.t_end) {
        this.setAnimater({t_start : t_start, t_end : t_end});
    }

    /** Loops the animation over the animation evolution time interval. 
     * 
     * @param {boolean} loop_animation animation is looped if true
     */
    loop(loop_animation = true) {
        this.setAnimater({loop_animation : loop_animation});
    }

    /** Enables recording of the canvas by saving individual frames of the animation.
     * 
     * @param {boolean} record_enabled enables recording if true
     * @param {string} filename name prefix given to recorded frames, where each frame's name is indexed as 'filename_{frame_number}'
     * @param {number} record_loops number of animation loops to record
     * @param {boolean} pre_loop allows one full animation loop to complete before recording starts if true
     */
    record(record_enabled = true, filename = 'frame_', record_loops = 1, pre_loop = false) {
        this.setAnimater({record_enabled: record_enabled, filename : filename, record_loops : record_loops, pre_loop : pre_loop});
    }

    /** Sets a maximum limit to the number of frames to record.
     * 
     * @param {number} record_max_frames  number of maximum recording frames
     */
    recordMaxFrames(record_max_frames) {
        this.setAnimater({record_max_frames : record_max_frames});
    }

    /** Configures and starts the animation
     * 
     * @param {object} settings_object an object of CanvasAnimater settings.
     */
    animate(settings_object) {
        this.animater.animate(settings_object);
    }

}

class Animater {
    constructor(canvas_id) {

        this.animation_settings = default_settings;

        this.draw = function() {};

        // canvas settings
        //this.width;
        //this.height;
        this.flex_canvas = false;
        this.center_canvas = false;
        this.canvas_margin = "-8px";
        this.canvas_id = canvas_id;
        this.canvas = new Canvas(this.canvas_id);
        this.canvas_context = this.canvas.context;

        // Evolver settings
        this.loop_animation = false;
        this.t_start = 0;
        this.t_end;
        this.t0 = this.t_start;
        this.t1 = this.t_end;
        this.t = 0;
        this.now = 0;
        this.then = 0;
        this.delta = 0;
        this.evolver = new Evolver(this.t0, this.t1, this.animation_rate, this.loop_animation);
    
        // animation settings
        this.fps = 50;
        this.animation_mode = "rate";
        this.animation_rate = 0.01;
        this.animation_frames = undefined;
        this.animating = false;
        this.rafID = undefined,

        // interaction settings
        this.interaction_enabled = false;
        this.interaction_modes = ['mousedownmove, touchmove'];
        this.interaction_origin = [0,0];
        this.scroll_width = 0,
        this.scroll_height = 0,
        this.interacter = new Interacter(this.canvas.element, false);
        this.interaction = function() {};

        // recording settings    
        this.record_enabled = false;
        this.record_max_frames = 1000;
        this.record_loops = 1;
        this.pre_loop = false;
        this.filename = 'frame_';
        this.recorder = new Recorder(this.canvas.element, this.filename);

        // dwitter settings
        this.dwitter_mode = false;
        this.dwitter_res = false;
        this.dwitter_scale = true;
        this.dwitterCode_set = false;
        this.dwitterCode_string = undefined;

    }

    set settings(settings) {
        this.setAnimater(settings);
    }

    get context() {
        return this.canvas.context;
    }

    get width() {
        return this.canvas.width;
    }

    set width(width) {
        this.canvas.width = width;
    }

    get height() {
        return this.canvas.height;
    }

    set height(height) {
        this.canvas.height = height;
    }

    setAnimater(settings_object) {
        let keys = Object.keys(settings_object);
        keys.forEach(setting => {this[setting] = this.animation_settings[setting] = settings_object[setting]});
    }

    FPS(fps) {
        this.setAnimater({fps : fps});
    }

    size(width, height) {
        this.setAnimater({width : width, height : height});
    }

    mode(animation_mode, p0, p1 = undefined) {
        let settings = {animation_mode : animation_mode};
        if (animation_mode == 'rate') {
            if (!(p0 == null)) {
                settings['animation_rate'] = p0;
            }
        }
        if (animation_mode == 'frames') {
            if (!(p0 == null)) {
                settings['animation_frames'] = p0;
            }
            if (!(p1 == null)) {
                settings['animation_rate'] = p1;
            }
        }
        if (animation_mode == 'time') {
            if (!(p0 == null)) {
                settings['animation_time'] = p0;
            }
            if (!(p1 == null)) {
                settings['animation_rate'] = p1;
            }
        }
        this.setAnimater(settings);
    }

    evolve(t_start = this.animation_settings.t_start, t_end = this.animation_settings.t_end, loop_animation = this.animation_settings.loop_animation) {
        this.setAnimater({t_start : t_start, t_end : t_end, loop_animation : loop_animation});
    }

    flexCanvas(flex_canvas = true) {
        this.setAnimater({flex_canvas : flex_canvas});
    }
    
    centerCanvas(center_canvas = true) {
        this.setAnimater({center_canvas : center_canvas});
    }

    flex() {
        this.canvas.resize(window.innerWidth, window.innerHeight);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        window.addEventListener('resize', e => {
            this.canvas.resize(window.innerWidth, window.innerHeight);
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            if (this.interaction_modes.includes("scroll")) {
                this.canvas.resize_wrapper(this.scroll_width, this.scroll_height);
            } 
        });
    }

    setCanvas(canvas_id) {
        this.canvas.element = this.animation_settings.canvas = document.getElementById(canvas_id);
        this.canvas.element.style = `margin : ${this.canvas_margin}`;
        if (!(this.width == null)) {
            this.canvas.width = this.canvas.element.width = this.width;
        }
        else {
            this.width = this.canvas.width = this.canvas.element.width;
        }
        if (!(this.height == null)) {
            this.canvas.height = this.canvas.element.height = this.height;
        }
        else {
            this.height = this.canvas.height = this.canvas.element.height;
        }
        if (this.center_canvas || this.interaction_modes.includes('scroll')) {
            this.canvas.create_wrapper(this.scroll_width, this.scroll_height);
            this.interacter.add_wrapper(this.canvas.wrapper, this.scroll_width, this.scroll_height);
        }
        if (this.center_canvas && !this.flex_canvas) {
            this.canvas.recenter();
        }
        if (this.flex_canvas) {
            this.flex();
        }
    }

    setDwitterMode() {
        window.c = this.canvas.element;
        window.x = this.canvas.context;
        window.S = Math.sin;
        window.C = Math.cos;
        window.T = Math.tan;
        window.R =(r,g,b,a=1)=>{return `rgba(${r},${g},${b},${a})`};
        
        if (this.dwitter_res == true) {
            this.setDwitterRes(1920, 1080);
        }
        this.draw = this.convertDwitterDraw();
    }

    convertDwitterDraw() {
        let code_string;
        if (this.dwitterCode_set) {
            code_string = this.dwitterCode_string;
        }
        else {
            code_string = this.draw.toString()
            code_string = code_string.substring(code_string.indexOf("{")+1, code_string.length-1);
        }
        if (this.dwitter_scale) {
           code_string = "c.width|=0;x.scale(c.width/1920,c.width/1920);"+code_string; 
        }
        return new Function('t', code_string);
    }

    setDwitterRes(w=1920,h=1080) {
        this.canvas.element.width = w;
        this.canvas.element.height = h;
    }

    setEvolver() {
        this.t0 = this.t_start;
        this.t1 = this.t_end;
        let total_iterations;

        if (this.loop_animation && this.t1 == null) {
            //console.log("Animater setting 't_end' must be defined if 'loop_animation' is 'true'.");
            throw "Animater setting 't_end' must be defined if 'loop_animation' is 'true'."
        }

        if (!["rate", "frames", "time"].includes(this.animation_mode)) {
            //console.log("'animation_mode' must be defined as either 'rate', 'time', or 'frames'.")
            throw "'animation_mode' must be defined as either 'rate', 'time', or 'frames'.";
        }

        if (this.animation_mode == "rate") {
            if (this.animation_rate == null) {
                //console.log("'animation_rate' must be defined if 'animation_mode' is 'rate'.");
                throw "'animation_rate' must be defined if 'animation_mode' is 'rate'.";
            }
            else {
                this.dt = Math.abs(this.animation_rate);
                if (!(this.t1 == null)) {
                    total_iterations = Math.ceil(Math.abs(this.t1 - this.t0)/this.dt);
                }
            }
        }
        else if (this.animation_mode == "frames") {
            if (this.animation_frames == null) {
                //console.log("'animation_frames' must be defined if 'animation_mode' is 'frames'.");
                throw "'animation_frames' must be defined if 'animation_mode' is 'frames'.";
            }
            else if (this.t1 == null) {
                if (this.animation_rate == null) {
                    //console.log("Animater setting 'animation_rate' must be defined if 'animation_mode' is 'frames' and 't_end' is undefined.");

                    throw "Animater setting 'animation_rate' must be defined if 'animation_mode' is 'frames' and 't_end' is undefined." ;
                }
                else {
                    this.dt = Math.abs(this.animation_rate);
                    total_iterations = this.animation_frames;
                }
            }
            else {
                this.dt = Math.abs(this.t1 - this.t0)/this.animation_frames;
                total_iterations = this.animation_frames;
            }
        }
        else if (this.animation_mode == "time") {
            if (this.animation_time == null) {
                //console.log("Animater setting 'animation_time' must be defined if 'animation_mode' is 'time'.");

                throw "Animater setting 'animation_time' must be defined if 'animation_mode' is 'time'." ;
            }
            else {
                if (this.t1 == null) {
                    if (this.animation_rate == null) {
                        //console.log("Animater setting 'animation_rate' must be defined if 'animation_mode' is 'time' and 't_end' is undefined.");

                        throw "Animater setting 'animation_rate' must be defined if 'animation_mode' is 'time' and 't_end' is undefined." ;
                    }
                    else {
                        this.dt = Math.abs(this.animation_rate);
                        total_iterations = this.fps*this.animation_time;
                        this.t1 = this.dt*total_iterations;
                    }
                }
                else {
                    total_iterations = this.fps*this.animation_time;
                    this.dt = Math.abs(this.t1 - this.t0)/total_iterations;
                }
            }
        }
        this.evolver.set(this.t0, this.t1, this.dt, this.loop_animation, total_iterations);
    }

    setInteracter(canvas, interaction, mode_list = ['mousedownmove', 'touchmove'], origin=[0,0], interaction_enabled) {
        this.interacter.canvas = canvas;
        this.interacter.interaction_enabled = interaction_enabled;
        this.interacter.interaction = interaction;
        this.interacter.flex_canvas = this.flex_canvas;
        this.interacter.origin = origin;
        this.interacter.update_origin();
        this.interaction_modes = mode_list;
        this.interacter.set_modes(mode_list);
        if (interaction_enabled) {
            this.interacter.listen();
        }
    }

    setRecorder(canvas, filename, record_enabled = true) {

        let total_frames;
        
        if (this.loop_animation) {
            total_frames = this.animation_frames*this.record_loops;
        }
        else if (this.animation_mode == "rate" && this.t1 == null) {
            total_frames = this.record_max_frames;
        }
        else {
            total_frames = this.evolver.total_iterations;
        }

        try {
            if (total_frames > this.record_max_frames) {

                let msg = `Request to record ${total_frames} frames exceeds maximum: 'record_max_frames = ${this.record_max_frames}' frames will be recorded!`;

                //console.log(msg);

                throw msg;
            } 
        }
        catch(msg) {                    
            alert(msg);
        }

        this.recorder.setRecorder(canvas, filename, total_frames);
        this.record_enabled = record_enabled;
    }

    record() {
        if ( this.recorder.frame < this.record_max_frames) {
            if (this.loop_animation) {
                let pre_count;
                if (this.pre_loop == true) {
                    pre_count = 1;
                }
                else {
                    pre_count = 0;
                }
                if ( pre_count <= this.evolver.loop_count && this.evolver.loop_count < pre_count + this.record_loops ) {
                    this.recorder.record();
                }
                else if (this.evolver.loop_count >= pre_count + this.record_loops) {
                    this.record_enabled = false;
                }
            }
            else {
                if (this.recorder.frame < this.recorder.total_frames) {
                    this.recorder.record();
                }
            }
        }
        else {
            try {
                this.record_enabled = false;

                let msg = `Maximum number of ${this.record_max_frames} recorded frames reached.  Change setting with Animater property 'record_max_frames'.`;

                //console.log(msg);
            
                throw msg;
            }
            catch(msg) {
                alert(msg);
                this.stopAnimation(this.rafID);
            }
            
        }
    }

    render(t) {
        this.draw(t);
        if (this.record_enabled) {
            this.record();
        }
    }

    throttle(time) {

        this.rafID = requestAnimationFrame(this.throttle.bind(this));
        let frame_dt = 1000/this.fps
        this.now = time;
        this.delta = this.now - this.then;
    
        if (this.delta > frame_dt) {
            this.then = this.now - (this.delta % frame_dt);

            this.render(this.t);

            if (this.evolver.evolving && this.start_animation) {
                this.t = this.evolver.evolve();
            }

            if (!(this.flex_canvas || this.interaction_enabled) ) {
                if (!this.evolver.evolving || !this.start_animation) {
                    this.stopAnimation(this.rafID);
                    //console.log("Animation stopped.");
                }
            }
        }

    }

    stopAnimation(requestID) {
        cancelAnimationFrame(requestID);
        this.animating = false;
    }

    animate(settings) {
        try {
            if (!(settings == null)) {
                this.setAnimater(settings);
            }
            else {
                this.setAnimater(this.animation_settings);
            }
            this.animating = this.animation_settings.start_animation;
            this.setCanvas(this.canvas_id);
            if (this.dwitter_mode) {
                this.setDwitterMode();
            }
            this.setEvolver();
            if (this.interaction_enabled) {
                this.setInteracter(this.canvas.element, this.interaction, this.interaction_modes, this.interaction_origin,this.interaction_enabled);
            }
            if (this.record_enabled) {
                this.setRecorder(this.canvas.element, this.filename, this.record_enabled);
            }
            this.then = window.performance.now();
            this.throttle(); 
        }
        catch(e) {
            this.stopAnimation(this.rafID);
            console.log("Animater stopped.");
            console.error(e)
            alert(e);
        }
    }

}

class Canvas {
    constructor(canvas_id) {
        this.id = canvas_id;
        this.element = document.getElementById(this.id);
        this.context = this.element.getContext('2d');
        //this.width = this.element.width;
        //this.height = this.element.height;
        this.style;
        this.wrapper; 
        this.wrapper_width;
        this.wrapper_height;
        this.flex_canvas;
        this.center_canvas;
    }

    get width() {
        return this.element.width;
    }

    set width(width) {
        this.element.width = width;
    }

    get height() {
        return this.element.height;
    }

    set height(height) {
        this.element.height = height;
    }

    resize(width, height) {
        this.width = this.element.width = width;
        this.height = this.element.height = height;
    }

    position(x_pos, y_pos) {
        this.element.style.left = `${x_pos}px`;
        this.element.style.top = `${y_pos}px`;
    }

    center() {
        let x_pos = (window.innerWidth - this.element.width)/2;
        let y_pos = (window.innerHeight - this.element.height)/2;
        this.position(x_pos, y_pos);
    }

    recenter() {
        this.center();
        window.addEventListener('resize', e=> {this.center()});
    }

    resize_wrapper(width, height) {
        this.wrapper.style.width = `${width}px`;
        this.wrapper.style.height = `${height}px`;
    }

    create_wrapper(width, height) {
        let wrapper_div = document.createElement('div');
        this.element.style.position = "fixed";
        wrapper_div.id = `${this.id}_wrapper`;
        wrapper_div.style.width = `${width}px`;
        wrapper_div.style.height = `${height}px`;
        //wrapper_div.style.overflow = "hidden";
        this.element.parentNode.insertBefore(wrapper_div, this.element);
        wrapper_div.appendChild(this.element);
        this.wrapper = wrapper_div;
    }

}

class Evolver {
    constructor(t0, t1, dt, loop_animation, total_iterations = undefined) {
        this.evolving = true;
        this.t0 = t0;
        this.t1 = t1;
        this.dt = (this.t0>=this.t1)?-Math.abs(dt):Math.abs(dt);
        this.t = this.t0;
        this.iterator = 0;
        this.total_iterations = total_iterations;
        this.loop_animation = loop_animation;
        this.loop_count = 0;
    }

    set(t0, t1, dt, loop_animation, total_iterations = undefined) {
        this.evolving = true;
        this.t0 = t0;
        this.t1 = t1;
        this.dt = (this.t0>=this.t1)?-Math.abs(dt):Math.abs(dt);
        this.t = this.t0;
        this.iterator = 0;
        this.total_iterations = total_iterations;
        this.loop_animation = loop_animation;
        this.loop_count = 0;
    }

    evolve() {
        if (this.loop_animation) {
            if (!(this.t1 == this.t0) && this.iterator < this.total_iterations) {
                this.t += this.dt;
                this.t = (this.t - this.t0)%(this.t1-this.t0)+this.t0;
                this.iterator += 1;
            }
            else {
                this.iterator = 0;
                this.loop_count +=1;
            }
        } 
        else {
            if (this.t1 == null) {
                this.t += this.dt;
                this.iterator += 1;
                if (!(this.total_iterations == null) && this.iterator >= this.total_iterations) {
                    this.evolving = false;
                }
            }
            else {
                this.t += this.dt;
                this.t = (this.t0<this.t1)?(this.t>=this.t1?this.t1:this.t):(this.t<=this.t1?this.t1:this.t);
                this.iterator += 1;
                if ( this.iterator >= this.total_iterations) {
                    this.evolving = false;
                }
            }
        }
        return this.t;
    }
}

class Interacter {
    constructor(canvas, interaction_enabled=true) {
        this.canvas = canvas;
        this.canvas_margin = (parseInt(this.canvas.style.margin.replace('px','')) || 0);
        this.canvas_wrapper = undefined;
        this.wrapper_width = 0;
        this.wrapper_height = 0;
        this.interaction_enabled = interaction_enabled;
        this.interaction = function() { };
        this.modes = ['mousedownmove','touchmove'];
        this.axis_orientation = '+-';
        this.mouse_pressed = false;
        this.touch_pressed = false;
        this.scrolling = false;
        this.origin = [0,0]
        this.origin_x = 0;
        this.origin_y = 0;
        this.norm_x = 0;
        this.norm_y = 0;
        this.canvas_x = 0;
        this.canvas_y = 0;
        this.scroll_x = 0;
        this.scroll_Y = 0;
        this.scroll_norm_x = 0;
        this.scroll_norm_y = 0;
        this.flex_canvas = false;
    }

    set_modes(mode_list) {
        if (typeof(mode_list) == 'string') {
            mode_list = [mode_list];
        }
        this.modes = mode_list;
    }

    set_origin(x,y) {
        this.origin = [x,y];
    }

    update_origin() {
        this.origin_x = this.origin[0]*this.canvas.width;
        this.origin_y = this.origin[1]*this.canvas.height;
    }

    set_action(canvas, event) {
        let boundary = canvas.getBoundingClientRect();
        this.canvas_x = event.clientX - boundary.left - this.origin_x;
        this.canvas_y = event.clientY - boundary.top - this.origin_y;
        this.norm_x = this.canvas_x/(canvas.width - this.origin_x);
        this.norm_y = this.canvas_y/(canvas.height - this.origin_y);
    }

    mouse_action(canvas, event) {
        this.set_action(canvas, event);
        this.interaction();
    }
    
    touch_action(canvas, events) {
        let event = events.touches[0];
        this.set_action(canvas, event);
        this.interaction();
    }

    scroll_action() {
        this.scroll_x = window.scrollX;
        this.scroll_y = window.scrollY;
        this.scroll_norm_x = this.scroll_x/(this.wrapper_width - this.canvas.width - this.canvas_margin);
        this.scroll_norm_y = this.scroll_y/(this.wrapper_height - this.canvas.height - this.canvas_margin);
        this.interaction();
    }

    add_wrapper(wrapper, width, height) {
        this.canvas_wrapper = wrapper;
        this.wrapper_width = width;
        this.wrapper_height = height;
    }

    listen() {
        
        if (this.flex_canvas) {
            this.update_origin();
            window.addEventListener('resize', e => {
                this.update_origin(); 
            });
        }

        if (this.modes.includes('mousedownmove') || this.modes.includes('mousehovermove')) {
            
            if (this.modes.includes('mousedownmove')) {
                this.canvas.addEventListener('mousedown', e => {
                    this.mouse_pressed = true;
                    this.mouse_action(this.canvas, e);
                });
                
                this.canvas.addEventListener('mouseup', e => {
                    this.mouse_pressed = false;
                    this.mouse_action(this.canvas, e);
                });
            }
        
            this.canvas.addEventListener('mousemove', e => {
                
                if (this.modes.includes('mousedownmove')) {
                    if(this.mouse_pressed) {
                        this.mouse_action(this.canvas, e);
                    }
                }
                else {
                    this.mouse_action(this.canvas, e);
                }
            })
        }

        if (this.modes.includes('touchmove')) {
            this.canvas.addEventListener('touchstart', e => {
                this.touch_pressed = true;
                this.touch_action(this.canvas, e);
                e.preventDefault();    
            })

            this.canvas.addEventListener('touchend', e => {
                this.touch_pressed = false;
                e.preventDefault();
            })

            this.canvas.addEventListener('touchmove', e => {
                this.touch_action(this.canvas, e);
                e.preventDefault();   
            })
        }

        if (this.modes.includes('scroll')) {
            window.addEventListener('scroll', e => {this.scroll_action()});
        }
    }

}

class Recorder {
    constructor(canvas, filename = 'frame_', total_frames = this.animation_frames) {
        this.canvas = canvas;
        this.filename = filename;
        this.total_frames = total_frames;
        this.frame = 0;
        this.loop = 0;
    }

    setRecorder(canvas, filename, total_frames) {
        this.canvas = canvas;
        this.filename = filename;
        this.total_frames = total_frames;
    } 

    download(filename) {
        let dataURL = this.canvas.toDataURL();
        let element = document.createElement('a');
        element.setAttribute('href', dataURL);
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      
        console.log('Downloaded ' + filename);
    }

    record() {
        let frame_number = this.frame.toString().padStart(this.total_frames.toString().length, '0');
        this.download(this.filename+frame_number+'.png', this.canvas);
        this.frame =  this.frame + 1;    
    } 
    
}