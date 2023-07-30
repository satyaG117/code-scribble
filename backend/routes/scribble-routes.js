const express = require('express');
const { isLoggedIn } = require('../middlewares/auth-middlewares');
const { validateInputs } = require('../middlewares/validation-middleware');
const { scribbleSchema, codeSchema } = require('../validation-schemas/scribble-schemas');
const scribbleControllers = require('../controllers/scribble-controllers');

const router = express.Router();

//create new one
router.post('/',isLoggedIn,validateInputs(scribbleSchema),scribbleControllers.createNewScribble);

// get data
router.get('/',scribbleControllers.getScribbles);

//edit general details
router.patch('/:scribbleId',isLoggedIn,validateInputs(scribbleSchema),scribbleControllers.updateScribble);


// delete
router.delete('/:scribbleId',isLoggedIn,scribbleControllers.deleteScribble);

// get data by id
router.get('/:scribbleId',scribbleControllers.getScribbleById);


// edit the code only html , css , js
router.patch('/:scribbleId/update-code',isLoggedIn , validateInputs(codeSchema),scribbleControllers.updateCode);

router.post('/:scribbleId/fork',isLoggedIn,scribbleControllers.forkScribble)

module.exports = router; 