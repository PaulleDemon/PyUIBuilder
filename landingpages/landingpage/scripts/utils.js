class SlideShow{

    constructor(slideContainer, autoNext=true, timeout=6000){

        this.slideContainer = slideContainer
        this.autoNext = autoNext

        this.slideIndex = 0
        this.timeout = null

        this.timeoutTime = timeout

        const dots = this.slideContainer.querySelectorAll('.dot')

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showSlides(index)
            })
        })

        const nextBtn = this.slideContainer.querySelector(".next")
        const previousBtn = this.slideContainer.querySelector(".prev")

        if (nextBtn && previousBtn){

            nextBtn.addEventListener("click", () => {this.plusSlides(1)})
            previousBtn.addEventListener("click", () => {this.plusSlides(-1)})

        }

        this.plusSlides = this.plusSlides.bind(this)
        this.currentSlide = this.currentSlide.bind(this)
        this.showSlides = this.showSlides.bind(this)
        
        this.showSlides(this.slideIndex)

    }

    plusSlides(i) {
        this.showSlides(this.slideIndex + i)
    }
    
    currentSlide(i) {
        this.showSlides(this.slideIndex + i)
    }

    showSlides(n){
        let slides = this.slideContainer.querySelectorAll(".slides")
        let dots = this.slideContainer.querySelectorAll(".dot")

        this.slideIndex = n

        if (n >= slides.length) { 
            this.slideIndex = 0 
        }
        if (n < 0) { 
            this.slideIndex = slides.length -1
        }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none"
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace("active", "")
        }

        slides[this.slideIndex].style.display = "block"
        dots[this.slideIndex].className += " active"

        if (this.autoNext){

            clearTimeout(this.timeout)

            this.timeout = setTimeout(() => this.plusSlides(1), this.timeoutTime)
        }
    }

}


class Modal{

    /**
     * 
     * @param {HTMLElement} modal 
     */
    constructor(modal, title, description){

        this.modal = modal

        const closeBtn = modal.querySelector("#modal-close")

        this.show = this.show.bind(this)
        this.close = this.close.bind(this)
        this.updateModal = this.updateModal.bind(this)
        this.updateButton = this.updateButton.bind(this)
        this.showModalInput = this.showModalInput.bind(this)
        this.hideModalInput = this.hideModalInput.bind(this)

        this.updateModal(title, description)
        closeBtn.addEventListener("click", this.close)

    }

    close(){
        this.modal.classList.add("tw-hidden")
    }

    show(){
        this.modal.classList.remove("tw-hidden")
    }

    showModalInput(){
        const input = this.modal.querySelector("#modal-input")
        input.classList.remove("tw-hidden")
    }

    hideModalInput(){
        const input = this.modal.querySelector("#modal-input")
        input.classList.add("tw-hidden")
    }

    updateButton(text, link){

        const actionBtn = this.modal.querySelector("#modal-action-btn")
        actionBtn.textContent = text
        if (link){
            actionBtn.setAttribute("href", link)
        }else{
            actionBtn.removeAttribute("href")
        }
        actionBtn.addEventListener("click", this.close)
    }

    updateModal(title, description){

        this.modal.querySelector("#modal-title").textContent = title
        this.modal.querySelector("#modal-description").textContent = description
        
    }

}   