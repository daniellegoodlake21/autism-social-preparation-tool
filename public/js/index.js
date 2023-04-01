const MAX_SENSORY_ENVIRONMENT_SCORE = 32;
const MAX_PEOPLE_SCORE = 16;
const MAX_UNEXPECTED_CHANGE_SCORE = 56;
const DEFAULT_WEIGHT = 2;

const ADVICE = {
    food: "New or difficult foods may be stressful for you in this social situation. Consider bringing your own familiar foods you enjoy.",
    smells: "Strong smells may be stressful for you in this social situation. Consider plannning breaks into the day where you can go elsewhere without the smells.",
    sounds: "You indicated that loud or sudden sounds may be stressful for you in this social situation. Consider wearing noise-cancelling headphones.",
    people: "You indicated a low support-people to other-people ratio. This means you may not feel as understood in the social situation. Consider having a pre-scripted short explanation in your head for if you need time to process something or misunderstand a comment or question. Choose whether to disclose your autism or give a more generic statement, based on what you feel comfortable with.",
    quietSpace: "It is not possible to go to a quiet space to take a break. Consider bringing a subtle sensory toy or headphones for personal music if either would be helpful.",
    foodChanges: "The food involved in this social situation may change. Consider checking nearby dining places online that it could change to, in order to become more familiar with them and their menu. You could ask what the 'plan B' or alternative arrangements are likely to be.",
    delays: "There may be delays resulting in you being late to an activity or the social situation as a whole. Consider creating an alternative plan for if this happens, leaving early, or requesting that the 'essential' part of the social situation, if any - for example a restaurant booking - is booked later in the day.",
    transportChanges: "You have indicated that you struggle with certain forms of transport and using them at short notice would be difficult. Consider having a script for buying your tickets, and/or having someone to support you or buy it for you - in which case, you can give them the cash in person before they buy your ticket.",
    spontaneity: "You may struggle with mandatory or encouraged spontaneous activities. Consider thinking of the possibilities for what could happen. Alternatively, think of an 'escape plan' if an activity suggested would be so stressful that you needed to leave early."
};

/* Calculate the score and generate the description for the Sensory Environment section of the report */
function generateSensoryEnvironmentReport(foodStressScore)
{
    let score = 0;
    // food
    let foodScore = Number($("input[name='food']:checked").val());

    score += foodStressScore * foodScore;
    // smells
    let smellScore = $("input[name='smells']").first().is(":checked")  ? DEFAULT_WEIGHT : 0;
    let smellStressScore = Number($("input[name='smells_distress']:checked").val() -1);
    score += smellScore * smellStressScore;
    // sounds
    let loudMusicScore = $("input[name='music']").first().is(":checked")  ? DEFAULT_WEIGHT: 0;
    let suddenSoundsScore = $("input[name='sounds']").first().is(":checked")  ? DEFAULT_WEIGHT : 0;
    let soundsStressScore = Number($("input[name='sounds_distress']:checked").val() -1);
    score += (loudMusicScore * soundsStressScore) + (suddenSoundsScore * soundsStressScore);
    $("#sensory_environment_score").text(score + " / " + MAX_SENSORY_ENVIRONMENT_SCORE);

    // provide a summary statement
    let summary;
    if (score === 0)
    {
        summary = "Your Sensory Environment score is 0. This means you should in theory have very little stress associated with the sensory environment in this social situation. That's great!";
    }
    else if (score < 12)
    {
        summary = "Your Sensory Environment score is low. That's great! This social situation's sensory environment is unlikely to cause you distress as an individual. However, here are some tips which may help for potential issues picked up on:";
    }
    else if (score < 24)
    {
        summary = "Your Sensory Environment score is medium level. You may find the sensory environment moderately stressful, so here are some suggestions for how to reduce the stress and have a calmer, happier experience:";
    }
    else 
    {
        summary = "Your Sensory Environment score is high. You may find the sensory environment highly stressful and difficult to cope with. The following advice may help to provide you with a more manageable experience:";
    }
    $("#sensory_stress_description").text(summary);
    // select relevant advice to help this individual in this specific social situation
    let adviceStatements = [];
    if (foodStressScore * foodScore > 0)
    {
        adviceStatements.push(ADVICE["food"]);
    }
    if (smellStressScore * smellScore > 0)
    {
        adviceStatements.push(ADVICE["smells"]);
    }
    if (soundsStressScore * suddenSoundsScore > 0 || soundsStressScore * loudMusicScore > 0)
    {
        adviceStatements.push(ADVICE["sounds"]);
    }
    // display the advice
    $("#sensory_environment_advice").empty();
    for (let i = 0; i < adviceStatements.length; i++)
    {
        $("#sensory_environment_advice").append("<li>" + adviceStatements[i] + "</li>");   
    }
    return score;
}

function generatePeopleReport()
{
    let score = 0;
    let supportPeopleCount = $("#support_people_count").val();
    let otherPeopleCount = $("#other_people_count").val();
    let percentageSupportPeople = (supportPeopleCount/otherPeopleCount)*100;
    let totalPeopleCount = supportPeopleCount + otherPeopleCount;
    /* determine whether there is enough support.
    For this to be true there should be at least 1 support person per 4 other people.
    This is equivalent to 20% of the total people or more. 
    Alternatively, if the group is large enough (20+ people) then only 4 
    support people are needed regardless of how many other people there are. */
    let enoughSupport;
    if (percentageSupportPeople >= 20 && totalPeopleCount < 20)
    {
        enoughSupport = true;
    }
    else if (totalPeopleCount >= 20 && supportPeopleCount >= 4)
    {
        enoughSupport = true;
    }
    else
    {
        enoughSupport = false;
    }
    let peopleStressScore = 0;
    // if there is not enough support this adds to the score
    if (!enoughSupport)
    {
        peopleStressScore = Number($("input[name='people_distress']:checked").val() -1);
        score += DEFAULT_WEIGHT * peopleStressScore;
    }
    // handle quiet space need and availability
    let quietSpaceScore =  $("input[name='quiet_space_available']").first().is(":checked")  ? 0 : DEFAULT_WEIGHT;
    let lackOfQuietSpaceDistress = Number($("input[name='needs_space']:checked").val()-1);
    score += quietSpaceScore * lackOfQuietSpaceDistress;
    $("#people_score").text(score + " / " + MAX_PEOPLE_SCORE);
    // provide a summary statement
    let summary;
    if (score === 0)
    {
        summary = "Your People and Crowds score is 0. This means you should in theory have very little stress associated with the people and need for space in this social situation. That's great!";
    }
    else if (score < 6)
    {
        summary = "Your People and Crowds score is low. That's great! The people involved and any need for a quiet space are unlikely to cause you distress as an individual. However, here are some tips which may help for potential issues picked up on:";
    }
    else if (score < 10)
    {
        summary = "Your People and Crowds score is medium level. You may find the people and crowds moderately stressful, so here are some suggestions for how to reduce the stress and have a calmer, happier experience:";
    }
    else 
    {
        summary = "Your People and Crowds score is high. You may find the people and crowds highly stressful and difficult to cope with. The following advice may help to provide you with a more manageable experience:";
    }
    $("#people_description").text(summary);
    // select relevant advice to help this individual in this specific social situation
    let adviceStatements = [];
    if (!enoughSupport)
    {
        adviceStatements.push(ADVICE["people"]);
    }
    if (quietSpaceScore * lackOfQuietSpaceDistress > 0)
    {
        adviceStatements.push(ADVICE["quietSpace"]);
    }
    // display the advice
    $("#people_advice").empty();
    for (let i = 0; i < adviceStatements.length; i++)
    {
        $("#people_advice").append("<li>" + adviceStatements[i] + "</li>");   
    }
    return score;
}

function generateUnexpectedChangeReport(foodStressScore)
{
    let score = 0;
    // food changes
    let foodChangesScore = Number($("input[name='food_changes']:checked").val() -1);
    score += foodChangesScore * foodStressScore;
    // timekeeping/delays
    let timekeepingScore = Number($("input[name='delays']:checked").val() -1);
    let timekeepingStressScore = Number($("input[name='timekeeping_distress']:checked").val() -1);
    score += timekeepingScore * timekeepingStressScore;
    // transport changes
    let transportScore = Number($("input[name='transport']:checked").val() -1);
    let transportStressScore = Number($("input[name='transport_distress']:checked").val() -1);
    score += transportScore * transportStressScore;
    // optional participation in spontaneous activities
    let optionalParticipationScore = $("input[name='participation']").first().is(":checked")  ? 0 : DEFAULT_WEIGHT;
    let spontaneityScore = Number($("input[name='spontaneity_distress']:checked").val() -1);
    score += optionalParticipationScore * spontaneityScore;
    $("#unexpected_changes_score").text(score + " / " + MAX_UNEXPECTED_CHANGE_SCORE);
    // provide a summary statement
    let summary;
    if (score === 0)
    {
        summary = "Your Unexpected Changes score is 0. This means you should in theory have very little stress associated with unexpected changes in this social situation. That's great!";
    }
    else if (score < 19)
    {
        summary = "Your Unexpected Changes score is low. That's great! This social situation's unexpected changes are unlikely to cause you distress as an individual. However, here are some tips which may help for potential issues picked up on:";
    }
    else if (score < 38)
    {
        summary = "Your Unexpected Changes score is medium level. You may find the unexpected changes moderately stressful, so here are some suggestions for how to reduce the stress and have a calmer, happier experience:";
    }
    else 
    {
        summary = "Your Unexpected Changes score is high. You may find the unexpected changes highly stressful and difficult to cope with. The following advice may help to provide you with a more manageable experience:";
    }
    $("#unexpected_changes_description").text(summary);
    // select relevant advice to help this individual in this specific social situation
    let adviceStatements = [];
    if (foodStressScore * foodChangesScore > 0)
    {
        adviceStatements.push(ADVICE["foodChanges"]);
    }
    if (timekeepingStressScore * timekeepingScore > 0)
    {
        adviceStatements.push(ADVICE["delays"]);
    }
    if (transportStressScore * transportScore > 0)
    {
        adviceStatements.push(ADVICE["transportChanges"]);
    }
    if (optionalParticipationScore * spontaneityScore > 0)
    {
        adviceStatements.push(ADVICE["spontaneity"]);
    }
    // display the advice
    $("#unexpected_changes_advice").empty();
    for (let i = 0; i < adviceStatements.length; i++)
    {
        $("#unexpected_changes_advice").append("<li>" + adviceStatements[i] + "</li>");   
    }
    return score;
}

function validateAllInput()
{
    let allValid = true;
    let firstInvalidInput = null;
    // clear previous invalid input messages
    $(".question .invalid-message").remove();
    // validate radio button questions
    $("input[type='radio']:required").each(function()
    {
        // check no option has been selected
        let radioInputName = $(this).attr("name");
        if (!$("input[name='" + radioInputName + "']:checked").val())
        {
            allValid = false;
            let answerRequiredMessage = $("<p>", {
                class: "invalid-message",
                text: "Please select an option."
            });
            let question = $(this).closest(".question");
            if (question.find(".invalid-message").length === 0)
            {
                question.append(answerRequiredMessage);
            }
            if (!firstInvalidInput)
            {
                firstInvalidInput = this;
            }
        }
    });
    // validate number input questions
    let supportPeopleCount = $("#support_people_count").val();
    let otherPeopleCount = $("#other_people_count").val();
    if (!isNaN(supportPeopleCount) && !isNaN(otherPeopleCount))
    {
        // check the total number of people attending is greater than 0
        if (supportPeopleCount + otherPeopleCount <= 0)
        {
            allValid = false;
            let answerRequiredMessage = $("<p>", {
                class: "invalid-message",
                text: "Please input a minimum of 1 person total who is attending."
            });
            $("#people_count_question").append(answerRequiredMessage);
        }
        if (!firstInvalidInput)
        {
            firstInvalidInput = $("#people_count_question");
        }
    }
    if (firstInvalidInput)
    {
        // scroll to first invalid input if there is one
        $([document.documentElement, document.body]).animate({
            scrollTop: $(firstInvalidInput).offset().top - 150
        }, 0);
        return allValid;
    }
}
function generateReport()
{
    let valid = validateAllInput();
    if (valid)
    {
        // foodStressScore is used in both generateSensoryEnvironmentReport and generateUnexpectedChangeReport so it is declared outside those functions
        let foodStressScore = Number($("input[name='food_distress']:checked").val()-1); /* for example, if the user strongly disagrees that
        new or disliked foods are distressing then the food score is multiplied by zero, so even if there are new or disliked
        foods it does not add to stress in this case. */
        let sensoryEnvironmentScore = generateSensoryEnvironmentReport(foodStressScore);
        let peopleScore = generatePeopleReport();
        let unexpectedChangeScore = generateUnexpectedChangeReport(foodStressScore);
        let totalScore = Number(sensoryEnvironmentScore) + Number(peopleScore) + Number(unexpectedChangeScore); // out of total possible points
        let maxPoints = MAX_SENSORY_ENVIRONMENT_SCORE + MAX_PEOPLE_SCORE + MAX_UNEXPECTED_CHANGE_SCORE;
        $("#total_score").text(totalScore + " / " + maxPoints);
        // once complete, display the report on-screen
        $("#situation-report-section").show();
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#situation-report-section").offset().top + 150
        }, 500);
    }

}