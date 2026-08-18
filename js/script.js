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
/* =====================================================
   STUDENT WEBSITES - CRUD
===================================================== */


/*
    Lấy các phần tử HTML
*/

const studentNameInput =
    document.getElementById("studentName");

const studentWebsiteInput =
    document.getElementById("studentWebsite");

const addWebsiteBtn =
    document.getElementById("addWebsiteBtn");

const websiteList =
    document.getElementById("websiteList");

const websiteMessage =
    document.getElementById("websiteMessage");

const websiteFormCard =
    document.querySelector(".website-form-card");


/*
    Lưu dữ liệu vào LocalStorage

    Nếu chưa có dữ liệu:
    sử dụng mảng rỗng []
*/

let studentWebsites =
    JSON.parse(
        localStorage.getItem("studentWebsites")
    ) || [];


/*
    ID website đang được chỉnh sửa

    null = đang thêm mới
*/

let editingWebsiteId = null;


/* =====================================================
   HIỂN THỊ WEBSITE
===================================================== */

function renderStudentWebsites() {

    websiteList.innerHTML = "";


    /*
        Không có website
    */

    if (studentWebsites.length === 0) {

        websiteList.innerHTML = `
            <div class="website-empty">
                Chưa có website nào được thêm.
            </div>
        `;

        return;
    }


    /*
        Hiển thị từng website
    */

    studentWebsites.forEach(website => {

        const item =
            document.createElement("div");

        item.className =
            "website-item";


        item.innerHTML = `

            <div class="website-info">

                <span class="website-name">
                    ${escapeHTML(website.name)}
                </span>

                <a
                    href="${escapeAttribute(website.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="website-url"
                >
                    ${escapeHTML(website.url)}
                </a>

            </div>


            <div class="website-actions">

                <button
                    type="button"
                    class="website-action website-open"
                    onclick="openStudentWebsite('${website.id}')"
                >
                    Mở website
                </button>


                <button
                    type="button"
                    class="website-action website-edit"
                    onclick="editStudentWebsite('${website.id}')"
                >
                    Sửa
                </button>


                <button
                    type="button"
                    class="website-action website-delete"
                    onclick="deleteStudentWebsite('${website.id}')"
                >
                    Xóa
                </button>

            </div>

        `;


        websiteList.appendChild(item);

    });

}


/* =====================================================
   THÊM / CẬP NHẬT WEBSITE
===================================================== */

addWebsiteBtn.addEventListener(
    "click",
    saveStudentWebsite
);


function saveStudentWebsite() {

    const name =
        studentNameInput.value.trim();

    let url =
        studentWebsiteInput.value.trim();


    /*
        Kiểm tra tên
    */

    if (!name) {

        showWebsiteMessage(
            "Vui lòng nhập tên sinh viên.",
            true
        );

        studentNameInput.focus();

        return;
    }


    /*
        Kiểm tra URL
    */

    if (!url) {

        showWebsiteMessage(
            "Vui lòng nhập đường link website.",
            true
        );

        studentWebsiteInput.focus();

        return;
    }


    /*
        Tự động thêm https://
        nếu người dùng chỉ nhập:

        abc.vercel.app
    */

    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        url =
            "https://" + url;

    }


    /*
        Kiểm tra URL hợp lệ
    */

    try {

        new URL(url);

    } catch (error) {

        showWebsiteMessage(
            "Đường link website không hợp lệ.",
            true
        );

        studentWebsiteInput.focus();

        return;
    }


    /*
        TRƯỜNG HỢP ĐANG SỬA
    */

    if (editingWebsiteId !== null) {

        const index =
            studentWebsites.findIndex(
                website =>
                    website.id ===
                    editingWebsiteId
            );


        if (index !== -1) {

            studentWebsites[index].name =
                name;

            studentWebsites[index].url =
                url;

        }


        showWebsiteMessage(
            "Đã cập nhật website thành công."
        );


        editingWebsiteId = null;


        addWebsiteBtn.innerHTML = `
            <span>Thêm website</span>
            <span class="btn-arrow">→</span>
        `;


        websiteFormCard.classList.remove(
            "editing"
        );

    }


    /*
        TRƯỜNG HỢP THÊM MỚI
    */

    else {

        const newWebsite = {

            id:
                Date.now().toString(),

            name:
                name,

            url:
                url

        };


        studentWebsites.push(
            newWebsite
        );


        showWebsiteMessage(
            "Đã thêm website vào danh sách chung."
        );

    }


    /*
        Lưu LocalStorage
    */

    localStorage.setItem(
        "studentWebsites",
        JSON.stringify(studentWebsites)
    );


    /*
        Xóa form
    */

    studentNameInput.value = "";

    studentWebsiteInput.value = "";


    /*
        Render lại danh sách
    */

    renderStudentWebsites();

}


/* =====================================================
   MỞ WEBSITE
===================================================== */

function openStudentWebsite(id) {

    const website =
        studentWebsites.find(
            item =>
                item.id === id
        );


    if (!website) {
        return;
    }


    window.open(
        website.url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =====================================================
   SỬA WEBSITE
===================================================== */

function editStudentWebsite(id) {

    const website =
        studentWebsites.find(
            item =>
                item.id === id
        );


    if (!website) {
        return;
    }


    /*
        Đưa dữ liệu lên form
    */

    studentNameInput.value =
        website.name;

    studentWebsiteInput.value =
        website.url;


    /*
        Lưu ID đang sửa
    */

    editingWebsiteId =
        website.id;


    /*
        Đổi nút
    */

    addWebsiteBtn.innerHTML = `
        <span>Cập nhật website</span>
        <span class="btn-arrow">✓</span>
    `;


    websiteFormCard.classList.add(
        "editing"
    );


    /*
        Cuộn lên form
    */

    websiteFormCard.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    studentNameInput.focus();

}


/* =====================================================
   XÓA WEBSITE
===================================================== */

function deleteStudentWebsite(id) {

    const website =
        studentWebsites.find(
            item =>
                item.id === id
        );


    if (!website) {
        return;
    }


    /*
        Xác nhận trước khi xóa
    */

    const confirmed =
        confirm(
            `Bạn có chắc muốn xóa website của "${website.name}"?`
        );


    if (!confirmed) {
        return;
    }


    /*
        Xóa dữ liệu
    */

    studentWebsites =
        studentWebsites.filter(
            item =>
                item.id !== id
        );


    /*
        Lưu lại LocalStorage
    */

    localStorage.setItem(
        "studentWebsites",
        JSON.stringify(studentWebsites)
    );


    /*
        Nếu đang sửa website
        vừa bị xóa
    */

    if (
        editingWebsiteId === id
    ) {

        editingWebsiteId = null;

        studentNameInput.value = "";

        studentWebsiteInput.value = "";

        addWebsiteBtn.innerHTML = `
            <span>Thêm website</span>
            <span class="btn-arrow">→</span>
        `;

        websiteFormCard.classList.remove(
            "editing"
        );

    }


    renderStudentWebsites();


    showWebsiteMessage(
        "Đã xóa website thành công."
    );

}


/* =====================================================
   HIỂN THỊ THÔNG BÁO
===================================================== */

function showWebsiteMessage(
    message,
    isError = false
) {

    websiteMessage.textContent =
        message;


    websiteMessage.classList.add(
        "show"
    );


    if (isError) {

        websiteMessage.classList.add(
            "error"
        );

    } else {

        websiteMessage.classList.remove(
            "error"
        );

    }


    clearTimeout(
        window.websiteMessageTimer
    );


    window.websiteMessageTimer =
        setTimeout(() => {

            websiteMessage.classList.remove(
                "show"
            );

        }, 3000);

}


/* =====================================================
   BẢO VỆ HTML
===================================================== */

function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

}


/* =====================================================
   LOAD WEBSITE
===================================================== */

renderStudentWebsites();