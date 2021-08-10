$(document).ready(function () {
    //add books to cart/the DB
    $(".to-cart").on("click", function() {
        let title = $(this).parent().siblings(".book-title").html();
        let imageUrl = $(this).parent().siblings(".results-book-cover").attr("src");
        let price = $(this).parent().siblings(".price").html();

        if(title != "") {
            // update shopping cart/add to DB
            updateCart("add", title, imageUrl, price);
            $(this).html("Added To Cart!");
            $(this).prop("disabled", "true");
        }
    });

    //delete books from cart/the DB
    $().on("click", function() {
        // if() {
            // update shopping cart/delete from DB
            // updateCart("delete", title);       
        // }
    });

    $(".results-book-cover").on("mouseover", async function() {
        await $(this).siblings(".description").fadeIn(1000);
        $(".results").on("mouseleave", async function() {
            await $(this).children(".description").fadeOut(1000);
        });
    });

    async function updateCart(action, title, imageUrl, price) {
        let url = `/api/updateCartItems?action=${action}&imageUrl=${imageUrl}&price=${price}&title=${title}`;
        alert(imageUrl)
        await fetch(url);
    }
});//ready