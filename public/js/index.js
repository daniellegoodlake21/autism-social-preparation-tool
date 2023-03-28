const MAX_SENSORY_ENVIRONMENT_SCORE = 32;

const DEFAULT_WEIGHT = 2;

const ADVICE = {
    food: "You indicated that new or difficult foods may be stressful for you in this social situation. Consider bringing your own familiar foods you enjoy.",
    smells: "You indicated that strong smells may be stressful for you in this social situation. Consider plannning breaks into the day where you can go elsewhere without the smells.",
    sounds: "You indicated that loud or sudden sounds may be stressful for you in this social situation. Consider wearing noise-cancelling headphones."
};

/* Calculate the score and generate the description for the Sensory Environment section of the report */
function generateSensoryEnvironmentReport()
{
    let score = 0;
    // food
    let foodScore = Number($("input[name='food']:checked").val());
    let foodStressScore = Number($("input[name='food_distress']:checked").val()-1); /* for example, if the user strongly disagrees that
    new or disliked foods are distressing then the food score is multiplied by zero, so even if there are new or disliked
    foods it does not add to stress in this case. */
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
    if (foodStressScore > 0)
    {
        adviceStatements.push(ADVICE["food"]);
    }
    if (smellStressScore > 0)
    {
        adviceStatements.push(ADVICE["smells"]);
    }
    if (soundsStressScore > 0)
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
    let totalPeopleCount = supportPeopleCount + otherPeopleCount
    let percentageSupportPeople = (supportPeopleCount/totalPeopleCount)*100;
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
    // if there is not enough support this adds to the score
    if (!enoughSupport)
    {
        let peopleStressScore = Number($("input[name='people_distress']:checked").val() -1);
        score += DEFAULT_WEIGHT * peopleStressScore;
    }
    // To do next: add to score for (lack of) quiet space.
}

function generateUnexpectedChangeReport()
{

}

function generateReport()
{
    let sensoryEnvironmentScore = generateSensoryEnvironmentReport();
    let peopleScore = generatePeopleReport();
    let unexpectedChangeScore = generateUnexpectedChangeReport();
    let totalScore = Number(sensoryEnvironmentScore) + Number(peopleScore) + Number(unexpectedChangeScore); // out of total possible points
    $("#totalScore").text(totalScore);
}

$("form").submit(function(e){
    e.preventDefault();
});