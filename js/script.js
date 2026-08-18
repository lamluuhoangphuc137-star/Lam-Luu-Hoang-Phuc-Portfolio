/* =====================================================
   MOBILE MENU
===================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const navbar =
    document.querySelector(".navbar");


menuToggle.addEventListener("click", () => {

    navbar.classList.toggle("show");

});


/* Đóng menu khi click link */

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("show");

        });

    });


/* =====================================================
   TYPING EFFECT
===================================================== */

const typingText =
    document.getElementById("typingText");


const texts = [

    "Sinh viên Công nghệ thông tin",

    "IT Student",

    "Web Developer",

    "Youth Union Member",

    "Đam mê công nghệ"

];


let textIndex = 0;

let charIndex = 0;

let deleting = false;


function typeEffect() {

    const currentText =
        texts[textIndex];


    if (!deleting) {

        typingText.textContent =
            currentText.substring(
                0,
                charIndex + 1
            );

        charIndex++;


        if (
            charIndex ===
            currentText.length
        ) {

            deleting = true;

            setTimeout(
                typeEffect,
                1800
            );

            return;
        }

    } else {

        typingText.textContent =
            currentText.substring(
                0,
                charIndex - 1
            );

        charIndex--;


        if (charIndex === 0) {

            deleting = false;

            textIndex =
                (textIndex + 1)
                % texts.length;

        }

    }


    setTimeout(
        typeEffect,
        deleting ? 45 : 75
    );

}


typeEffect();


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "show"
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach(element => {

    observer.observe(element);

});


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll("section[id]");


const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener(
    "scroll",
    () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                sectionTop + sectionHeight
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove(
                "active"
            );


            if (
                link.getAttribute("href")
                === `#${current}`
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    }
);


/* =====================================================
   MOUSE PARALLAX FOR AVATAR
===================================================== */

const imageCard =
    document.querySelector(".image-card");


document.addEventListener(
    "mousemove",
    (event) => {

        if (
            window.innerWidth < 900
        ) {
            return;
        }


        const x =
            (window.innerWidth / 2 -
                event.clientX) /
            50;


        const y =
            (window.innerHeight / 2 -
                event.clientY) /
            50;


        imageCard.style.transform =
            `rotateY(${x}deg)
             rotateX(${y}deg)`;

    }
);


document.addEventListener(
    "mouseleave",
    () => {

        imageCard.style.transform =
            "rotate(2deg)";

    }
);