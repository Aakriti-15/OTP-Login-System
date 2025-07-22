exports.showDietForm = (req,res)=>{
    res.render('diet');// this renders diet.hbs when a user clicks on 
};

exports.generatePlan = (req, res) => {
  const goal = req.body.goal;
  let plan = [];

  if (goal === 'weight_loss') {
    plan = ['Oats', 'Flax seeds', 'Green tea', 'Boiled veggies'];
  } else if (goal === 'reduce_cramps') {
    plan = ['Banana', 'Warm soups', 'Magnesium-rich food'];
  }

  const items = plan.join(', ');
  res.redirect(`/grocery?items=${encodeURIComponent(items)}`);
};
