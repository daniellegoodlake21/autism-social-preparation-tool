const MAX_SENSORY_ENVIRONMENT_SCORE = 0; // change this

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
    let smellScore = $("input[name='smells']").first().is(":checked")  ? 2 : 0;
    let smellStressScore = Number($("input[name='smells_distress']:checked").val() -1);
    score += smellScore * smellStressScore;
    // sounds
    let loudMusicScore = $("input[name='music']").first().is(":checked")  ? 2 : 0;
    let suddenSoundsScore = $("input[name='sounds']").first().is(":checked")  ? 2 : 0;
    let soundsStressScore = Number($("input[name='sounds_distress']:checked").val() -1);
    score += (loudMusicScore * soundsStressScore) + (suddenSoundsScore * soundsStressScore);
    $("#sensory_environment_score").text(score);


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

}

function generatePeopleReport()
{

}

function generateUnexpectedChangeReport()
{

}

function generateReport()
{
    generateSensoryEnvironmentReport();
}

$("form").submit(function(e){
    e.preventDefault();
});