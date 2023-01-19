


let H = nj.uint8([[1,1,0,1,1,0,0], [1,0,1,1,0,1,0], [0,1,1,1,0,0,1], [1,0,1,0,1,0,1]]) 

//let H_rep = nj.array([[1,1,0], [0,1,1]])

//let H_rep_cycle = nj.array([[1,1,0], [0,1,1], [1,0,1]])
 
let C = new HGPCode(H, H)

let rows_L = C.code1_n
let cols_L = C.code1_n
let rows_R = C.code0_m
let cols_R = C.code0_m


let logZL = C.logical_Z_L()
let logZR = C.logical_Z_R()
let logXL = C.logical_X_L()
let logXR = C.logical_X_R()


let array_XL = (!logXL.length)?null:logXL[0].tolist() 
let array_XR = (!logXR.length)?null:logXR[0].tolist()
let array_ZL = (!C.stab_Z(1,1)[0].tolist().length)?null:C.stab_Z(1,1)[0].tolist()
let array_ZR = (!C.stab_Z(1,1)[1].tolist().length)?null:C.stab_Z(1,1)[1].tolist()

//////////////
//////////////

let index1 = 1;
let slider1 = document.getElementById("myRange1");
let output1 = document.getElementById("demo1");
let mathtext1 = document.getElementById("mathtext1")

let slider1_val = slider1.value
slider1.max = logXL.length;
output1.innerHTML = (!logXL.length)?'undefined':`${slider1_val} &le; ${slider1.max}`

slider1.oninput = function() {
    output1.innerHTML = (!logXL.length)?'undefined':`${this.value} &le; ${slider1.max}`;
    index1 = this.value
    MathJax.typeset()
    if (checkBox1.checked) {
        array_XL = (!logXL.length)?null:logXL[index1 - 1].tolist()
    }
    else {
        array_XL = null
    }  
}

let checkBox1 = document.getElementById("myCheck1");
checkBox1.checked = true
check1_action();
function check1_action() {
    if (checkBox1.checked) {
        array_XL = logXL[index1 - 1].tolist()
    }
    else {
        array_XL = null
    }   
}


//////////

let index2 = 1;
let slider2 = document.getElementById("myRange2");
let output2 = document.getElementById("demo2");

let slider2_val = slider2.value
output2.innerHTML = (!logXR.length)?'undefined':`${slider2_val} &le; ${slider2.max}`
slider2.max = logXR.length;

slider2.oninput = function() {
    output2.innerHTML = (!logXR.length)?'undefined':`${this.value} &le; ${slider2.max}`;
    index2 = this.value
    MathJax.typeset()
    if (checkBox2.checked) {
        array_XR = logXR[index1 - 1].tolist()
    }
    else {
        array_XR = null
    }  
}

let checkBox2 = document.getElementById("myCheck2");
checkBox2.checked = true
check2_action();
function check2_action() {
    if (checkBox2.checked) {
        array_XR = (!logXR.length)?null:logXR[index2 - 1].tolist()
    }
    else {
        array_XR = null
    }   
}

///////


let index3 = 1;
let index4 = 1;
let slider3 = document.getElementById("myRange3");
let output3 = document.getElementById("demo3");
let mathtext3 = document.getElementById("mathtext3")

let slider3_val = slider3.value
slider3.max = C.code0_n;
output3.innerHTML = (!C.stab_Z(1,1)[0].tolist().length)?'undefined':`${slider3_val} &le; ${slider3.max}`

slider3.oninput = function() {
    output3.innerHTML = `${this.value} &le; ${slider3.max}`;
    index3 = this.value
    MathJax.typeset()
    if (checkBox3.checked) {
        array_ZL = C.stab_Z(index3,index4)[0].tolist()
        array_ZR =  C.stab_Z(index3,index4)[1].tolist()
    }
    else {
        array_ZL = null
        array_ZR = null
    }  
}

let checkBox3 = document.getElementById("myCheck3");
checkBox3.checked = true
check3_action();
function check3_action() {
    if (checkBox3.checked) {
        array_ZL = (!C.stab_Z(index3,index4)[0].tolist().length)?null:C.stab_Z(index3,index4)[0].tolist()
        array_ZR =  C.stab_Z(index3,index4)[1].tolist()
    }
    else {
        array_ZL = null
        array_ZR = null
    }   
}



let slider4 = document.getElementById("myRange4");
let output4 = document.getElementById("demo4");
let mathtext4 = document.getElementById("mathtext4")

let slider4_val = slider4.value
slider4.max = C.code1_m;
output4.innerHTML = (!C.stab_Z(1,1)[1].tolist().length)?'undefined':`${slider4_val} &le; ${slider4.max}`

slider4.oninput = function() {
    output4.innerHTML = (!C.stab_Z(index3,index4)[1].tolist().length)?'undefined':`${this.value} &le; ${slider4.max}`;
    index4 = this.value
    MathJax.typeset()
    if (checkBox3.checked) {
        array_ZL = (!C.stab_Z(index3,index4)[0].tolist().length)?null:C.stab_Z(index3,index4)[0].tolist()
        array_ZR = C.stab_Z(index3,index4)[1].tolist()
    }
    else {
        array_ZL = null
        array_ZR = null
        array_ZL = null
    } 
}

///////////////
///////////////

let canvasAnimater = new CanvasAnimater("myCanvas")
let ctx = canvasAnimater.context;
let settings_object = {
    width: 500,
    height: 500, 
    center_canvas: false,
    flex_canvas: false,
    fps: 24,
    loop_animation: true,
    t_start: 0,
    t_end: 0,
    animation_mode: "time",
    animation_time: 1,
}

canvasAnimater.draw = function (t) {
    
    let W = canvasAnimater.width;
    let H = canvasAnimater.height;
    
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, W, H); 
  
    let margin_size = 50
    let length = Math.min(W,H) - 2*margin_size
    let x0 = margin_size
    let y0 = margin_size
    double_grid(nj.ones([rows_L, cols_L]).tolist(), nj.ones([rows_R, cols_R]).tolist(), length, rows_L, cols_L, rows_R, cols_R, x0, y0, true, "white", true, "black", "all")
    double_grid_overlay(array_XL, array_XR, array_ZL, array_ZR, length, rows_L, cols_L, rows_R, cols_R, x0, y0)
}

////////////////
////////////////

function disk(x_pos, y_pos, radius, fill, fill_color, stroke, stroke_color, fill_section) {
    let fill_factor;
    let clockwise;
    if (fill_section == "all") {
        fill_factor = 2;
        clockwise = true;
    }
    else if (fill_section == "top") {
        fill_factor = 1;
        clockwise = true;
    }
    else if (fill_section == "bot") {
        fill_factor = 1;
        clockwise = false;
    }
    ctx.beginPath();
    ctx.arc(x_pos, y_pos, radius, 0, fill_factor*Math.PI, clockwise);
    ctx.closePath();
    if (stroke) {
        ctx.strokeStyle = stroke_color;
        ctx.lineWidth = 4;
        ctx.stroke();
    }
    if (fill) {
        ctx.fillStyle = fill_color;
        ctx.fill();
    }
}


function grid_scaled(array, radius, rows, cols, x0, y0, fill, fill_color, stroke, stroke_color, fill_section) {
    if (array != null) {
        let spacing = 4*radius
        for(let col = 0; col < cols; col++) {
            for(let row = 0; row < rows; row++) {
                if (array[row][col] == 1) {
                    disk(x0 + col*spacing, y0 + row*spacing, radius, fill, fill_color, stroke, stroke_color, fill_section);
                }
            }
        } 
    }   
}

function grid_scaled_overlay(array0, array1, radius, rows, cols, x0, y0) {
    let spacing = 4*radius
    for(let col = 0; col < cols; col++) {
        for(let row = 0; row < rows; row++) {
            let b1;
            if (array0 == null) {
                b1 = 0
            }
            else {
                b1 = array0[row][col]
            }
            let b2;
            if (array1 == null) {
                b2 = 0
            }
            else {
                b2 = array1[row][col]
            }
            let fill_color;
            let fill_section;
            let x_pos = x0 + col*spacing
            let y_pos = y0 + row*spacing
            if (b1 == 1 && b2 == 1) {
                disk(x_pos, y_pos, radius, true, "blue", false, "black", "top")
                disk(x_pos, y_pos, radius, true, "red", false, "black", "bot")
            }
            else {
                if (b1 == 0 && b2 == 0) {
                    fill_color = "white"
                    fill_section = "all"
                }
                else if (b1 == 1 && b2 == 0) {
                    fill_color = "blue"
                    fill_section = "all"
                }
                else if (b1 == 0 && b2 == 1) {
                    fill_color = "red"
                    fill_section = "all"
                }    
                disk(x_pos, y_pos, radius, true, fill_color, false, "black", fill_section);
            }
        }
    }  
}

function double_grid(array_L, array_R, length, rows_L, cols_L, rows_R, cols_R, x0, y0, fill, fill_color, stroke, stroke_color, fill_section) {

    let max_dim = Math.max(rows_L, rows_R, cols_L + cols_R)
    let radius = length/(3*max_dim - 2)/2
    let length_L = 2*radius*(3*cols_L - 2)
    let x_R = x0 + length_L + 0

    grid_scaled(array_L, radius, rows_L, cols_L, x0, y0, fill, fill_color, stroke, stroke_color, fill_section)
    grid_scaled(array_R, radius, rows_R, cols_R, x_R, y0, fill, fill_color, stroke, stroke_color, fill_section)

}

function double_grid_overlay(array_L0, array_R0, array_L1, array_R1, length, rows_L, cols_L, rows_R, cols_R, x0, y0) {

    let max_dim = Math.max(rows_L, rows_R, cols_L + cols_R)
    let radius = length/(3*max_dim - 2)/2
    let length_L = 2*radius*(3*cols_L - 2)
    let x_R = x0 + length_L + 0
    grid_scaled_overlay(array_L0, array_L1, radius, rows_L, cols_L, x0, y0)
    grid_scaled_overlay(array_R0, array_R1, radius, rows_R, cols_R, x_R, y0)
}


// render the animation
canvasAnimater.animate(settings_object);