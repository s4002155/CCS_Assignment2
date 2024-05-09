class Vector {
    constructor (x, y) {
       this.x = x
       this.y = y
    }
 
    add (v) {
       this.x += v.x
       this.y += v.y
    }
 
    subtract (v) {
       this.x -= v.x
       this.y -= v.y
    }
 
    mult (m) {
       this.x *= m
       this.y *= m
    }
 
    mag () { 
       // using a^2 + b^2 = c^2
       return ((this.x ** 2) + (this.y ** 2)) ** 0.5
    }
 
    set_mag (m) {
       const safe_mag = this.mag ()
       if (safe_mag == 0) return
       this.mult (m / safe_mag)
    }
 
    rotate (a) {
       // https://matthew-brett.github.io/teaching/rotation_2d.html
 
       const new_x = (this.x * Math.cos (a)) - (this.y * Math.sin (a))
       const new_y = (this.x * Math.sin (a)) + (this.y * Math.cos (a))
 
       this.x = new_x
       this.y = new_y
    }
 
    clone () {
       return new Vector (this.x, this.y)
    }
 }
 
 function vector_from_angle (angle, magnitude) {
    const x = magnitude * Math.cos (angle)
    const y = magnitude * Math.sin (angle)
    return new Vector (x, y)
 }
 