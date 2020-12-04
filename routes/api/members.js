const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const members = require('../../members.js')

// Gets all members
router.get('/', (req, res) => res.json(members));

// Get single member
router.get('/:id', (req, res) => {
    // res.send(req.params.id);
    const found = members.some(member => member.id === parseInt(req.params.id));

    if(found) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)))
    } else {
        res.status(400).json({msg: `No member w/ id of ${req.params.id}`})
    }
});

// Create Member
router.post('/', (req, res) => {
    // res.send(req.body);

    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }

    if(!newMember.name || !newMember.email){
        return res.status(400).json({msg: 'Please Include Name & Email'});
    }

    members.push(newMember);
    // console.log(members);

    res.json(members);
});

// Update Member
router.put('/:id', (req, res) => {
    // res.send(req.params.id);
    const found = members.some(member => member.id === parseInt(req.params.id));

    if(found) {
        const updateMember = req.body;

        members.forEach(member => {
            if(member.id === parseInt(req.params.id)){
                member.name = updateMember.name ? updateMember.name : member.name
                member.email = updateMember.email ? updateMember.email : member.email

                res.json({msg: 'Member Updated', member});
            }
        });
    } else {
        res.status(400).json({msg: `No member w/ id of ${req.params.id}`})
    }
});

// Delete single member
router.delete('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if(found) {
        res.json({msg: 'Member Deleted',
        members: members.filter(member => member.id !== parseInt(req.params.id))
        });
    } else {
        res.status(400).json({msg: `No member w/ id of ${req.params.id}`})
    }
});

module.exports = router;

// Get -> get info, Post -> send info, Put -> update info