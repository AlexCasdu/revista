document.addEventListener('DOMContentLoaded', function () {
    var pageFlip = new St.PageFlip(document.getElementById('flipbook'), {
        width: 550, height: 733, size: 'stretch',
        minWidth: 280, maxWidth: 900, minHeight: 380, maxHeight: 1200,
        maxShadowOpacity: 0.35,
        showCover: true,
        mobileScrollSupport: false,
        autoSize: true,
        usePortrait: true,
        startPage: 0,
        flippingTime: 700,
        disableFlipByClick: true,
        showPageCorners: true,
        swipeDistance: 30
    });
    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
    var totalPages = document.querySelectorAll('.page').length;
    var pageInfo = document.getElementById('pageInfo');
    function updateInfo() {
        pageInfo.textContent = 'Página ' + (pageFlip.getCurrentPageIndex() + 1) + ' de ' + totalPages;
    }
    pageFlip.on('flip', updateInfo);
    updateInfo();

    document.getElementById('btnPrev').addEventListener('click', function () { pageFlip.flipPrev(); });
    document.getElementById('btnNext').addEventListener('click', function () { pageFlip.flipNext(); });
    document.getElementById('btnExplore').addEventListener('click', function () { pageFlip.turnToPage(2); });
    document.getElementById('btnSumario').addEventListener('click', function () { pageFlip.turnToPage(1); });

    // Comportamiento de revista: clic en los BORDES voltea la página,
    // clic en el centro (zona de lectura) no hace nada.
    var book = document.getElementById('flipbook');
    book.addEventListener('click', function (e) {
        var rect = book.getBoundingClientRect();
        var x = e.clientX - rect.left;
        if (x >= rect.width * 0.72) {
            pageFlip.flipNext();
        } else if (x <= rect.width * 0.28) {
            pageFlip.flipPrev();
        }
    });

    // Re-render con debounce al cambiar el tamaño
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            try { pageFlip.update(); } catch (err) { /* noop */ }
        }, 200);
    });

    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('light');
            themeToggle.textContent = document.body.classList.contains('light') ? '🌙' : '☀';
            localStorage.setItem('mea-theme', document.body.classList.contains('light') ? 'light' : 'dark');
        });
    }
    var printBtn = document.getElementById('printBtn');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
    var backTop = document.getElementById('backTop');
    if (backTop) {
        backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        window.addEventListener('scroll', function () {
            backTop.classList.toggle('show', window.scrollY > 300);
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') pageFlip.flipNext();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') pageFlip.flipPrev();
    });
});
