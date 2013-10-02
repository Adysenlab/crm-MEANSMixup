/**
 * PartialsController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  
  /**
   * /partials/create
   */ 
  create: function (req,res) {

    // This will render the view: 
    // D:\Node\Apps\sails9\testProject2/views/partials/create.jade
    res.view();

  },


  /**
   * /partials/destroy
   */ 
  destroy: function (req,res) {

    // This will render the view: 
    // D:\Node\Apps\sails9\testProject2/views/partials/destroy.jade
    res.view();

  },


  /**
   * /partials/tag
   */ 
  tag: function (req,res) {

    // This will render the view: 
    // D:\Node\Apps\sails9\testProject2/views/partials/tag.jade
    res.view();

  },


  /**
   * /partials/like
   */ 
  like: function (req,res) {

    // This will render the view: 
    // D:\Node\Apps\sails9\testProject2/views/partials/like.jade
    res.view();

  }

};
