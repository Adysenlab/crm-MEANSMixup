/**
 * GridController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

GridController = {

    saveGrid: function (req, res, next) {
        gridcol = req.param("gridcol");
        user = req.param("user");
        gridname = req.param("gridname");
        // console.log('-------------saveGrid--------------grid-----------------------',gridcol);//,req.body.data);
        console.log('---------GridController----saveGrid--------------user-----gridname------------------',user,gridname);//req.param("user"));//,req.body.data);
        //  console.log('-------------saveGrid-------------------------------------',req.param("user"));//,req.body.data);
        Grid.find({ GridName: gridname, StaffInit: user})
            .done(function (err, grid) {
                //   Error handlingz
                console.log('-------------function--------------grid-----------------------',grid[0]===undefined);//...GridName);

                if (err) {
                    console.log('grid err ', grid)
                    return console.log(err);
                } else {
                    // do something else ...
                   // console.log('\n grid.GridName...',grid,'...',grid[0].GridName,'...',grid[0].id,'...')
                    if (grid[0]===undefined) {
                        //console.log('in grid create ', grid[0].GridName)
                        Grid.create({
                            GridForm: gridcol,
                            GridName: gridname,
                            StaffInit: user
                        })
                            .then(function (grid) {
                                console.log('========createed===============================', grid.GridName)
                            })
                            .catch(function (err) {
                                console.error('er ', err)
                                deferred.reject(err);
                                return next(err);
                            })
                    }
                    else {
                        console.log('\n in grid upd ', grid[0].GridName)
                        Grid.update({ GridName:gridname, StaffInit: user}, {GridForm: gridcol}, function poUpdated(err) {
                            if (err) {
                                console.log(' err :', err);
                            }
                        });
                    }
                }
            })

    },
    getGrid: function (req, res, next) {
        gridcol = req.param("gridcol");
        user = req.param("user");
        gridname = req.param("gridname");

        console.log('-------------getGrid----------------------------user---gridname------',user,gridname);//,req.body.data);
        Grid.find({ GridName:gridname, StaffInit: user})
            .done(function (err, grid) {
                // Error handling
                if (err) {
                    console.log('grid err ', grid)
                    return console.log(err);
                } else {
                    // do something else ...
                    if (grid[0]===undefined) {
                        //  console.log('in grid create ', grid[0].GridName)
                        Grid.create({
                            GridForm: gridcol,
                            GridName: gridname,
                            StaffInit: user
                        })
                            .then(function (grid) {
                                console.log('========create===============================', grid.GridName)
                                res.json({ colDefs: 'created' });
                            })
                            .catch(function (err) {
                                console.error('er ', err)
                                deferred.reject(err);
                                return next(err);
                            })
                    }
                    else {
                         console.log('in sending back grid ', grid[0].GridForm, grid[0].GridName)
                        res.json({ colDefs: grid[0].GridForm });
                    }
                }
            })

    },



    /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to GridController)
   */
  _config: {}


};
module.exports = GridController;
//console.log('PoController ', PoController)
