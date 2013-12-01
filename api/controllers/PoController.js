///**
// * PoController
// *
// * @module		:: Controller
// * @description	:: Contains logic for handling requests.
// */
//

/*---------------------
 :: PO
 -> controller
 ---------------------*/
var _ = require('underscore'); // see passport service
var Q = require('q');
var PDFDocument = require('pdfkit');
var tiger = require('./tiger');
var moment = require('moment');
var accounting = require('accounting');
var PoController;
PoController = {
    // process the info from edit view
    create: function (req, res, next) {
        var deferred = Q.defer();
        var nid;
        var aid = req.param("AccountID");
        if (aid != '400690') {
            Po.create({
                Comments: req.param("Comments"),
                // PONumber: nid,
                TaxPcnt: req.param("TaxPcnt"),
                AccountID: req.param("AccountID"),
                acctDesc: req.param("acctDesc"),
                VendorID: req.param("VendorID"),
                TaxAmount: req.param("TaxAmount"),
                Freight: req.param("Freight"),
                SubTotal: req.param("SubTotal"),
                POTotal: req.param("POTotal"),
                Date: req.param("Date"),
                POType: req.param("POType"),
                VendorInvNum: req.param("VendorInvNum"),
                VendorInvDate: req.param("VendorInvDate"),
                //  vendor: req.param("Vendor"),
                Status: req.param("Status"),
                vendor: req.param("vendor"),
                details: req.param("details")
                // twos: req.param("twos")
            })
                .then(function (po) {
                    //console.log("Email created::", Email);
                    var poid = po.POID;
                    var pid = po.id;
                    console.log('return ', po)
                    return res.json({ data: po });
                })
                .catch(function (err) {
                    // console.error('er ',err)
                    // return next(err);
                }

            )

        } else {

            Po.create({
                Comments: req.param("Comments"),
                // PONumber: nid,
                TaxPcnt: req.param("TaxPcnt"),
                AccountID: req.param("AccountID"),
                acctDesc: req.param("acctDesc"),
                VendorID: req.param("VendorID"),
                TaxAmount: req.param("TaxAmount"),
                Freight: req.param("Freight"),
                SubTotal: req.param("SubTotal"),
                POTotal: req.param("POTotal"),
                Date: req.param("Date"),
                POType: req.param("POType"),
                VendorInvNum: req.param("VendorInvNum"),
                VendorInvDate: req.param("VendorInvDate"),
                //  vendor: req.param("Vendor"),
                Status: req.param("Status"),
                vendor: req.param("vendor"),
                details: req.param("details"),
                twos: req.param("twos")
            })
                .then(function (po) {
                    // console.log("Po created::", po);
                    var poid = po.POID;
                    var pid = po.id;
                    var aid = po.AccountID;
                    var twos = '';

                    twos = req.param("twos");
                    var newTwos = [];
                    //console.log('=======================Two====TWO,twos,poid========',TWO,twos,poid)
                    var i = 0
                    twos.forEach(function (two) {
                        i++;
                        // var deferred = Q.defer();
                        var deferredT = Q.defer();
                        var holdtwo = two;
                        var twolist;
                        console.log('TwoCreate============================== ', i);
                        //console.log('po ',po);
                        // must have at least 1 two to get next avail #
                        //var nid = TWO.getNextTWOONumber();// getNextTWOONumber;
                        // console.log('nid ',nid);
                        TWO.create({
                            //TWOID: nid,
                            Comments: po.Comments,
                            POID: poid,
                            TenantID: holdtwo.TenantID,
                            CompanyName: holdtwo.CompanyName,
                            Description: holdtwo.Description,
                            TaxPcnt: req.param("TaxPcnt"),
                            AccountID: req.param("AccountID"),
                            VendorID: req.param("VendorID"),
                            TaxAmount: req.param("TaxAmount"),
                            Freight: req.param("Freight"),
                            SubTotal: req.param("SubTotal"),
                            POTotal: req.param("POTotal"),
                            Date: req.param("Date"),
                            POType: req.param("POType"),
                            VendorInvNum: req.param("VendorInvNum"),
                            VendorInvDate: req.param("VendorInvDate"),
                            //  vendor: req.param("Vendor"),
                            Status: req.param("Status"),
                            vendor: req.param("vendor"),
                            details: req.param("details")
                        })
                            .then(function (two) {
                                console.log('=======================================')
                                // return res.json({ data: two });
                                // problem with gening next id for TWOID
                                // since I cant set TWOID tring + ii-1
                                var pod = {"TenantID": holdtwo.TenantID, "CompanyName": holdtwo.CompanyName, Description: holdtwo.Description, "TwoID": two.id};//, "TwoID2": two.TWOID}//TWOID}
                                //console.log("\npod created::", pod);
                                newTwos.push(pod);
                                //deferredT.resolve(TWO);
                                deferred.resolve(newTwos);
                                console.log("\nnewTwos created::", newTwos);
                            })
                            .catch(function (err) {
                                console.error('er ', err)
                                deferred.reject(err);
                                return next(err);
                            })
                        //deferred.resolve(newTwos);
                    });

                    // console Po.update({POID: poid, $set: {twos: newTwos}});
                    Q.all([ deferred.promise])
                        .then(function (results) {
                            var nt = results[0];
                            console.log('\npid ', pid)
                            console.log('\nnewTwos results', results, nt)
                            //Po.update(pid, {newtwos: newTwos}, function poUpdated(err) {
                            Po.update(pid, {twos: nt}, function poUpdated(err) {
                                if (err) {
                                    console.log(' err :', err);
                                }
                            });
                            console.log('===================after====Two============', twos)
                            // console.log('===================newTwos================', newTwos)
                        });
                    return res.json({ data: po });
                })
                .catch(function (err) {
                    console.error('er ', err)
                    return next(err);
                })
        }
    },

    findAllWrapped: function(req, res, next) {
// use this for updateWrapped
        Po.find()
            .sort('POID ASC')
            .exec(function(err, peos) {
                if (err) return next(err);
               // console.log('PoController::findAllWrapped... ',peos);
                res.json({ data: peos });
            });
    },

    updateWrapped: function (req, res, next) {
        var id = req.body.id;
        console.log('-------------updateWrapped-------------------------------------');//,req.body.id,id)
        ////delete $scope.po.id; // if i delete update does not work      //console.log('back  - ',$scope.po1,id);

        Po.update(id, req.params.all(), function poUpdated(err) {
            if (err) {
                console.log(' err :', err);
            }
        });
        console.log('-----success--------updateWrapped---cambriai----calibri-------------pdfCreate-----params------------', req.params.all());//,poid,req.body)
        var poid = req.body.POID;
        var par = req.param;
        var potext, pohead , part, _i, _len;
        var doc;
        doc = new PDFDocument;
        doc.info['Title'] = 'PTTest';
        doc.info['Author'] = 'John Tomaselli';
        doc.registerFont('Palatino', './api/fonts/PalatinoBold.ttf');
        doc.registerFont('cambria', './api/fonts/Cambria.ttc');

        var startcol = 45;

        var deferred = Q.defer();
        var vendorrec;
        var v = req.body.vendor.VendorID;
        console.log('Vendor ', v);
        Vendor.find({VendorID: v}).done(function (err, vendor) {
            if (err) {
                deferred.reject(err);
                return next(err);
            } else {
                vendorrec = vendor;//.toArray()
                //deferred.resolve(res.json(vendorlist));
                deferred.resolve(vendorrec);
                console.log('updateWrapped::Vendor.find with filter... ', vendorrec[0]);//, res.json(vendorlist[10]));
            }
        });

        Q.all([ deferred.promise])
            .then(function (results) {
                vend = results[0][0];
                console.log('updateWrapped::vend ', vend)
//   });
                doc.font('Palatino').fontSize(22).fillColor("grey").text('PARK TOWER ', startcol, 95).font('Palatino').fontSize(11).text('MANAGEMENT, LTD.', startcol + 160, 104);
                potext = '';
                doc.font('Palatino').fontSize(10).text(potext, startcol, 200, {

                    width: 410,
                    align: 'left'
                });

                linePos = 150;
                startcol2 = startcol + 55;
                startcol3 = 450;
                doc.text('PO#', startcol, linePos).text(poid, startcol2, linePos);
                linePos += 15;
                doc.text('Vendor#', startcol, linePos).text(v, startcol2, linePos);//req.body.vendor.VendorID
                linePos += 15;

                doc.text('Vendor', startcol, linePos).text(vend.CompanyName, startcol2, linePos);//req.body.vendor.CompanyName
                linePos += 15;
                doc.text('Addr', startcol, linePos).text(vend.Address, startcol2, linePos);
                linePos += 25;
                doc.text('City St Zip', startcol, linePos).text(vend.City + ' ' + vend.State + ' ' + vend.ZipCode, startcol2, linePos);
                linePos += 15;

                linePos = 150;
                startcol2 = startcol + 55;
                startcol3 = 410;
                doc.text('Bill & Ship To', startcol3, linePos);
                linePos += 10;
                doc.text('Building Manager', startcol3, linePos);
                linePos += 10;
                doc.text('Park Tower Managers Ltd. ', startcol3, linePos);
                linePos += 10;
                doc.text('535 Madison Ave.', startcol3, linePos);
                linePos += 10;
                doc.text('New York, NY 10022', startcol3, linePos);
                linePos += 10;
                doc.text('(212) 308-4177', startcol3, linePos);


                //(col,row)
                var VDATE = moment(req.body.VendorInvDate).format("MM/DD/YYYY");
                var PODATE = moment(req.body.Date).format("MM/DD/YYYY");

                linePos = 250;
                startcol2 = startcol + 155
                doc.text('Date', startcol, linePos).text('Company', 100, linePos).text('VendorInvNo', 210, linePos).text('VendorInvDate', 290, linePos).text('Account', 390, linePos).text('Status', 520, linePos);
                linePos += 20;
                doc.text(PODATE, startcol, linePos).text(vend.CompanyName, 100, linePos, {width: 110, align: 'left' }).text(req.body.VendorInvNum, 210, linePos).text(VDATE, 290, linePos).text(req.body.acctDesc, 390, linePos, {width: 130, align: 'left' }).text(req.body.Status, 520, linePos);

                linePos += 25;
                startcol = 45;
                doc.text('Comments', startcol, linePos).text(req.body.Comments, 105, linePos, {width: 410, align: 'left' });

                var peos = req.body.details;//[1]

                var linePos = 390;
                doc.font('Palatino').fontSize(10).text('Qty', 45, linePos)
                    .text('Account', 70, linePos)
                    .text('Desc', 160, linePos)
                    .text('UnitPrice', 460, linePos)
                    .text('Tax', 500, linePos, {width: 40, align: 'right' })
                    .text('Total', 540, linePos, {width: 40, align: 'right' });

                linePos += 20

                peos.forEach(function (po) {
                    doc.font('Palatino').fontSize(10).text(po.Quantity, 45, linePos)
                        .text(po.AccountName, 70, linePos, {width: 90, align: 'left' })
                        .text(po.Desc, 160, linePos, {width: 270, align: 'left' })
                        .text(accounting.formatMoney(po.UnitPrice), 430, linePos, {width: 50, align: 'right' })
                        .text(accounting.formatMoney(po.LineItemTax), 480, linePos, {width: 50, align: 'right' })
                        .text(accounting.formatMoney(po.LineItemTot), 530, linePos, {width: 50, align: 'right' });
                    //linePos+=20

                    linePos = doc.y + 20;
                });
                linePos = doc.y + 100;// 100


                doc.rect(430, linePos - 20, 170, 125)
                    .stroke();


                var totCol = 440;
                var tolCol2 = 500;
                doc.font('Palatino').fontSize(10).text(potext, startcol, 200, {width: 410, align: 'right' });

                doc.text('Subtotal', totCol, linePos).text(accounting.formatMoney(req.body.SubTotal), tolCol2, linePos, {width: 80, align: 'right' });
                linePos += 20;
                doc.text('Tax%', totCol, linePos).text(req.body.TaxPcnt, tolCol2, linePos, {width: 80, align: 'right' });
                linePos += 20;
                doc.text('TaxAmt', totCol, linePos).text(accounting.formatMoney(req.body.TaxAmount), tolCol2, linePos, {width: 80, align: 'right' });
                linePos += 20;
                doc.text('Freight', totCol, linePos).text(accounting.formatMoney(req.body.Freight), tolCol2, linePos, {width: 80, align: 'right' });
                linePos += 20;
                doc.font('Palatino', 12).fillColor("blue").text('Total', totCol, linePos).text(accounting.formatMoney(req.body.POTotal), tolCol2, linePos, {width: 80, align: 'right' });

                //          doc.write('./api/uploads/po' + poid + '.pdf');

                linePos += 40;
                startcol2 = 300;
                startcol3 = 350;
                doc.text(PODATE, startcol2, linePos);
                linePos += 20;
                //line cap settings
                doc.lineWidth(2);
                doc.lineCap('butt')
                    .moveTo(startcol, linePos)
                    .lineTo(startcol + 155, linePos)
                    .stroke()
                    //  doc.lineWidth(2);
                    //  doc.lineCap('butt')
                    .moveTo(startcol2, linePos)
                    .lineTo(startcol2 + 75, linePos)
                    .stroke();

                //  doc.text('---------------------------------------', startcol, linePos).text('--------------', startcol2, linePos);
                linePos += 5;

                doc.font('Palatino', 12).fillColor("blue").text(' Authorized Signature ', startcol, linePos).text('Date', startcol2, linePos);

                doc.write('./api/uploads/po' + poid + '.pdf');
                res.redirect('/po');
            });// the promise
    },
    stuffed: function (req, res, next) {
        console.log('PoController:stuffed... ');
        var deferred = Q.defer();
        var vendorlist;
        Vendor.find({
        }).sort('VendorNumber ASC').done(function (err, vendors) {
                if (err) {
                    deferred.reject(err);
                    return next(err);
                } else {
                    vendorlist = vendors;//.toArray()
                    //deferred.resolve(res.json(vendorlist));
                    deferred.resolve(vendorlist);
                    console.log('Vendor.find with filter... ', vendorlist[10]);//, res.json(vendorlist[10]));
                }
            });
        //console.log('lets get pos');
        var deferredP = Q.defer();
        var polist;
        Po.find({
            //}).sort('POID DSC').done(function (err, peos) {
        }).sort({POID: -1}).done(function (err, peos) {
                if (err) {
                    deferredP.reject(err);
                    return next(err);
                } else {
                    polist = peos;//.toArray()
                    //deferred.resolve(res.json(vendorlist));
                    deferredP.resolve(polist);
                    // console.log('polist.find with filter... ', polist[10]);//, res.json(vendorlist[10]));
                }
            });
        var deferredA = Q.defer();
        var acctlist;
        Account.find({
        }).done(function (err, accts) {
                if (err) {
                    deferredA.reject(err);
                    return next(err);
                } else {
                    acctlist = accts;//.toArray()

                    deferredA.resolve(acctlist);
                    // console.log('Vendor.find with filter... ', acctlist[10]);//, res.json(vendorlist[10]));
                }

            });

        /**
         * The function searches over the array by certain field value,
         * and replaces occurences with the parameter provided.
         *  var vendor = _.find(vendors, function(vendor) { finds first matching vendor in list
     *  po.vendorName = vendor.CompanyName; pushes the name at end of json object

     */
        Q.all([
                deferred.promise,
                deferredP.promise ,
                deferredA.promise

            ])
            .then(function (results) {
                var vendors = results[0];
                var peos = results[1];
                var accts = results[2];
                peos.forEach(function (po) {
                    var vendor = _.find(vendors, function (vendor) {
                        return vendor.VendorID === po.VendorID;
                    });
                    if (vendor) {
                        po.vendorName = vendor.CompanyName;
                    } else {
                        po.vendorName = 'N/A';
                    }

                    var acct = _.find(accts, function (acct) {
                        return acct.AccountID === po.AccountID;
                    });
                    if (acct) {
                        po.acctDesc = acct.Desc;
                    } else {
                        po.acctDesc = 'N/A';
                    }


                });

                // return
                res.json({ data: peos });
                //res.json(peos);


            });


//  var  doc;
//  doc = new PDFDocument;
//  //     doc.font('fonts/segoeui.ttf').fontSize(25).text('Some text with an embedded font!', 100, 100);
//  doc.addPage().fontSize(25).text('Here is some vector graphics...', 100, 100);
//  doc.save().moveTo(100, 150).lineTo(100, 250).lineTo(200, 250).fill("#FF3300");
//  doc.scale(0.6).translate(470, -380).path('M 250,75 L 323,301 131,161 369,161 177,301 z').fill('red', 'even-odd').restore();
//  doc.addPage().fillColor("blue").text('Here is a link!', 100, 100).underline(100, 100, 160, 27, {
//    color: "#0000FF"
//  }).link(100, 100, 160, 27, 'http://google.com/');
//
//    var loremIpsum, part, _i, _len;
//
//    doc.info['Title'] = 'Test Document';
//
//    doc.info['Author'] = 'Devon Govett';
//
//    doc.registerFont('Palatino', 'fonts/PalatinoBold.ttf');
//
//    doc.font('Palatino').fontSize(25).text('Some text with an embedded font!', 100, 100).fontSize(18).text('PNG and JPEG images:').image('images/test.png', 100, 160, {
//      width: 412
//    }).image('images/test.jpeg', 190, 400, {
//        height: 300
//      });
//
//    doc.addPage().fontSize(25).text('Here is some vector graphics...', 100, 100);
//
//    doc.save().moveTo(100, 150).lineTo(100, 250).lineTo(200, 250).fill("#FF3300");
//
//    doc.circle(280, 200, 50).fill("#6600FF");
//
//    doc.scale(0.6).translate(470, -380).path('M 250,75 L 323,301 131,161 369,161 177,301 z').fill('red', 'even-odd').restore();
//
//    loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;\nMauris at ante tellus. Vestibulum a metus lectus. Praesent tempor purus a lacus blandit eget gravida ante hendrerit. Cras et eros metus. Sed commodo malesuada eros, vitae interdum augue semper quis. Fusce id magna nunc. Curabitur sollicitudin placerat semper. Cras et mi neque, a dignissim risus. Nulla venenatis porta lacus, vel rhoncus lectus tempor vitae. Duis sagittis venenatis rutrum. Curabitur tempor massa tortor.';
//
//    doc.text('And here is some wrapped text...', 100, 300).font('Helvetica', 13).moveDown().text(loremIpsum, {
//      width: 412,
//      align: 'justify',
//      indent: 30,
//      paragraphGap: 5
//    });
//
//    doc.addPage().font('Palatino', 25).text('Rendering some SVG paths...', 100, 100).translate(220, 300);
//
//    for (_i = 0, _len = tiger.length; _i < _len; _i++) {
//      part = tiger[_i];
//      doc.save();
//      doc.path(part.path);
//      if (part['stroke-width']) {
//        doc.lineWidth(part['stroke-width']);
//      }
//      if (part.fill !== 'none' && part.stroke !== 'none') {
//        doc.fillAndStroke(part.fill, part.stroke);
//      } else {
//        if (part.fill !== 'none') {
//          doc.fill(part.fill);
//        }
//        if (part.stroke !== 'none') {
//          doc.stroke(part.stroke);
//        }
//      }
//      doc.restore();
//    }
//
//    doc.addPage().fillColor("blue").text('Here is a link!', 100, 100).underline(100, 100, 160, 27, {
//      color: "#0000FF"
//    }).link(100, 100, 160, 27, 'http://google.com/');
//
//    doc.fillColor('#000').font('fonts/Chalkboard.ttc', 'Chalkboard', 16).list(['One', 'Two', 'Three'], 100, 150);
//
//    doc.write('out.pdf');
//
//
//  doc.write('./api/uploads/po'+poid+'.pdf');;//doc.write('./api/uploads/output.pdf');
//
//    var map = function () {
//      var output= {vendorname:this.name.first, lastname:this.name.last , department:db.department.findOne({_id:this.department}).department}
//      emit(this._id, output);
//    };
//    Po.native(function (err,collection) {
//      //collection.find()
//      // ZipCode : {startsWith:"100"}
//      var map
//      coll
//
//    }).sort('VendorNumber ASC').done(function(err, vendors) {
//        if (err) return next(err);
//        // pass the array down to the /views/vendor.ejs page
//        res.json(vendors);
//        console.log('Vendor.find with filter... ',vendors[0]);
//      });


    },
    updatePDF: function (req, res, next) {

        console.log('-------------updatePDF-------------------------------------')
        var poid = req.body.POID;
        var par = req.param;
        var potext, pohead , part, _i, _len;
        var doc;
        doc = new PDFDocument;
        doc.info['Title'] = 'PTTest';
        doc.info['Author'] = 'John Tomaselli';
        doc.registerFont('Palatino', './api/fonts/PalatinoBold.ttf');
        //doc.registerFont('calibri', './api/fonts/calibri.ttf');

        var startcol = 45;
        //(Col,Row)
        // doc.font('Palatino').fontSize(15).text('ParkTower PO', startcol, 115).image('./api/images/GTZ Logo.png', 180, 50, {
//      width: 312
//  });

        doc.font('./api/fonts/cambria.ttc', 'cambria').fontSize(22).text('PARK TOWER', startcol, 115).font('./api/fonts/cambria.ttc', 'cambria').fontSize(11).text('MANAGEMENT, LTD.', startcol + 150, 115);


        potext = '';

        doc.font('Palatino').fontSize(10).text(potext, startcol, 200, {
            width: 410,
            align: 'left'
        });

        linePos = 150;
        startcol2 = startcol + 55;
        startcol3 = 410;
        doc.text('POID', startcol, linePos).text(poid, startcol2, linePos).text('Bill & Ship To', startcol3, linePos);
        linePos += 10;
        doc.text('Vendor', startcol, linePos).text(req.body.vendor.CompanyName, startcol2, linePos).text('Builing Manager', startcol3, linePos);
        linePos += 10;
        doc.text('Addr', startcol, linePos).text(req.body.vendor.CompanyName, startcol2, linePos).text('ParkTower ', startcol3, linePos);
        linePos += 10;
        doc.text('CSZ', startcol, linePos).text(req.body.vendor.CompanyName, startcol2, linePos).text('535 Mad', startcol3, linePos);
        linePos += 10;

        doc.text('NYC 10022', startcol3, linePos);
        linePos += 10;
        doc.text('(212) 308-4177', startcol3, linePos);


        //(col,row)
        var VDATE = moment(req.body.VendorInvDate).format("MM/DD/YYYY");
        var PODATE = moment(req.body.Date).format("MM/DD/YYYY");
        linePos = 230;
        startcol2 = startcol + 155
        doc.text('Date', startcol, linePos).text('Company', 100, linePos).text('Status', 260, linePos).text('VendorInvNo', 340, linePos).text('VendorInvDate', 440, linePos);
        linePos += 20;
        doc.text(PODATE, startcol, linePos).text(req.body.vendor.CompanyName, 100, linePos).text(req.body.Status, 260, linePos).text(req.body.VendorInvNum, 340, linePos).text(VDATE, 440, linePos);
        linePos += 20;
        startcol = 45;
        doc.text('Comments', startcol, linePos).text(req.body.Comments, 155, linePos);

        var peos = req.body.details;//[1]

        var linePos = 390;
        doc.text('Qty', 45, linePos).text('Account', 70, linePos).text('Desc', 260, linePos).text('UnitPrice', 340, linePos).text('Tax', 440, linePos).text('Total', 500, linePos);

        linePos += 20

        peos.forEach(function (po) {
            doc.text(po.Quantity, 45, linePos).text(po.AccountName, 70, linePos).text(po.Desc, 260, linePos).text(accounting.formatMoney(po.UnitPrice), 340, linePos).text(accounting.formatMoney(po.LineItemTax), 440, linePos).text(accounting.formatMoney(po.LineItemTot), 500, linePos);
            linePos += 20
        });

        linePos += 20
        var totCol = 440;
        var tolCol2 = 500;
        doc.font('Palatino').fontSize(10).text(potext, startcol, 200, {width: 410, align: 'right' });
        doc.text('Subtotal', totCol, linePos).text(accounting.formatMoney(req.body.SubTotal), tolCol2, linePos, {width: 80, align: 'right' });
        linePos += 20;
        doc.text('Tax%', totCol, linePos).text(req.body.TaxPcnt, tolCol2, linePos, {width: 80, align: 'right' });
        linePos += 20;
        doc.text('TaxAmt', totCol, linePos).text(accounting.formatMoney(req.body.TaxAmount), tolCol2, linePos, {width: 80, align: 'right' });
        linePos += 20;
        doc.text('Freight', totCol, linePos).text(accounting.formatMoney(req.body.Freight), tolCol2, linePos, {width: 80, align: 'right' });
        linePos += 20;
        doc.font('Palatino', 15).fillColor("blue").text('Total', totCol, linePos).text(accounting.formatMoney(req.body.POTotal), tolCol2, linePos, {width: 80, align: 'right' });
        doc.write('./api/uploads/po' + poid + '.pdf');
        //doc.write('./api/uploads/output.pdf');
        res.redirect('/po');

    },
    pdfCREATE: function (req, res, next) {
        //  console.log('-------------pdfCREATE-------------------------------------',req)
        var poid = req.body.POID;
        //console.log('-------------poid-------------------------------------',req.body)
        var par = req.param;

        console.log('-------------pdfCREATE----------------pdfCREATE---------------------')
//  res.redirect('/po');

    }


};
module.exports = PoController;
console.log('PoController ', PoController)