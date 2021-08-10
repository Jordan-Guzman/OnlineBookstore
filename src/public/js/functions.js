$(document).ready(function () {
    //add books to cart/the DB
    $(".to-cart").on("click", function() {
        let title = $(this).parent().siblings(".book-title").html();
        let imageUrl = $(this).parent().siblings(".results-book-cover").attr("src");
        let price = $(this).parent().siblings(".price").html();

        if(title != "") {
            // update shopping cart/add to DB
            addToCart(title, imageUrl, price);
            $(this).html("Added To Cart!");
            $(this).prop("disabled", "true");
        }
    });

    //delete books from cart/the DB
    $(".remove-from-cart").on("click", function() {
        let title = $(this).siblings(".cart-book-title").html();
        removeFromCart(title);
        $(this).parent().remove();
    });

    $(".results-book-cover").on("mouseover", async function() {
        await $(this).siblings(".description").fadeIn(1000);
        $(".results").on("mouseleave", async function() {
            await $(this).children(".description").fadeOut(1000);
        });
    });

    async function addToCart(title, imageUrl, price) {
        let url = `/api/addToCart?imageUrl=${imageUrl}&price=${price}&title=${title}`;
        await fetch(url);
    }

    //successfully removes from the DB
    async function removeFromCart(title) {
        let url = `/api/removeFromCart?title=${title}`;
        await fetch(url);
    }
});//ready