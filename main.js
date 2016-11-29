/* Calculator project v0.5      Vernon Louie    C11.16      November 25, 2016 */

$(document).ready(function () {
    $(".button").click(button_clicked);     // Call function card_clicked when clicking on a card
    $(".reset").click(reset_clicked);   // Call function reset_clicked when clicking on the reset button
});

function gut (abc, def, ghi) {

    $(".container1 .display").text(abc);

}

gut("calculated", 7, 8);

function button_clicked () {
    $(this).;

    if (first_card_clicked === null) {
        first_card_clicked = this;
    }
    else {
        second_card_clicked = this;

        attempts++;
        accuracy = match_counter / attempts;
        display_stats();

        var first_img = $(first_card_clicked).parent().children(".front").find("img").attr('src');
        var second_img = $(second_card_clicked).parent().children(".front").find("img").attr('src');
        // console.log("attempts: ", attempts);

        if (first_img == second_img) {
            match_counter++;
            accuracy = match_counter / attempts;
            display_stats();

            first_card_clicked = null;
            second_card_clicked = null;
            // console.log("match counter is: ", match_counter);

            if (match_counter === total_possible_matches) {
                $('#game_area').append("<h3>You have won!  Word to the mother!</h3>");
            }
            else {
                return;
            } // end of 3rd if block
        }
        else {
            setTimeout(resetTwoCards, 1500);
            return;
        } // end of 2nd if block

    } // end of 1st if block

} // end of function card_clicked