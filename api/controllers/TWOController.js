/**
 * TWOController
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
    index: function (req, res, next) {
        console.log('two index... ');
        TWO.find({
        }).sort('CompanyName ASC').done(function(err, twos) {
                if (err) return next(err);
                // pass the array down to the /views/vendor.ejs page
                //res.json(users);
                res.json({data:twos});

                console.log('tenants index after res.json... ');
            });
    },

    updateWrapped: function (req, res, next) {
        var id = req.body.id;
        console.log('---------TWO----updateWrapped-------------------------------------');//,req.body.id,id)
        ////delete $scope.po.id; // if i delete update does not work      //console.log('back  - ',$scope.po1,id);

        TWO.update(id, req.params.all(), function TWOUpdated(err) {
            if (err) {
                console.log(' err :', err);
            }
        });
        console.log('-----success--------updateWrapped---cambriai----calibri-------------pdfCreate-----params------------', req.params.all());
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

//                doc.text 'This text is right aligned. ' + lorem,
//                    width: 410
//                align: 'right
//                .text('Tax', 500, linePos, {width: 40, align: 'right' })
                linePos = 95;
                doc.font('Palatino').fontSize(22).fillColor("grey")
                 .text('TENANT WORK ORDER ', startcol, linePos,{width: 500, align: 'center' });
                linePos += 15;

                doc.text('PARK TOWER ', startcol, linePos,{width: 500, align: 'center' }).font('Palatino').fontSize(11).text('MANAGEMENT, LTD. II', startcol + 160, 104);
                linePos += 15;
                doc.text('535 MADISON AVENUE ', startcol, linePos,{width: 500, align: 'center' });
                linePos += 15;
                doc.text('NEW YORK, NY 10022 ', startcol, linePos,{width: 500, align: 'center' });


                potext = '';
                doc.font('Palatino').fontSize(10).text(potext, startcol, 200, {

                    width: 410,
                    align: 'left'
                });
                /*tributes: {
                 "Comments" : "Test",
                 "POID" : 14515,
                 "TenantID" : "000140289",
                 "CompanyName" : "BRICS",
                 "Description" : "1",
                 "TaxPcnt" : "0",
                 "AccountID" : "400690",
                 "VendorID" : "27330",
                 "TaxAmount" : 0,
                 "Freight" : 0,
                 "SubTotal" : 1,
                 "POTotal" : 1,
                 "Date" : "11/30/2013",
                 "POType" : null,
                 "VendorInvNum" : "1130-1a",
                 "VendorInvDate" : "11/30/2013",
                 "Status" : "create",
                 "vendor" : {
                 "VendorID" : "27330",
                 "CompanyName" : "CON EDISON"
                 },
                 "details" : [
                 {"Quantity" : 1, "Desc" : "tesr",  "UnitPrice" : 1, "AccountID" : 400690, "AccountName" : "TENANT CHARGES", "LineItemTax" : 0, "LineItemTot" : 1, "MODE" : false
                 }
                 ],
                 "TWOID" : 10,
                */
                linePos = 150;
                startcol2 = startcol + 55;
                startcol3 = 450;

                var VDATE = moment(req.body.VendorInvDate).format("MM/DD/YYYY");

                doc.text('Date', startcol, linePos).text(VDATE, startcol2, linePos);
                linePos += 15;

                doc.text('W.O. #', startcol, linePos).text(TWOID, startcol2, linePos);
                linePos += 15;
                doc.text('Tenant', startcol, linePos).text(CompanyName, startcol2, linePos);//req.body.vendor.VendorID
                linePos += 15;

                doc.text('Vendor', startcol, linePos).text(vend.CompanyName, startcol2, linePos);//req.body.vendor.CompanyName
                linePos += 15;
                doc.text('Contact', startcol, linePos).text(vend.Address, startcol2, linePos);
                linePos += 25;

                linePos = 150;
                startcol2 = startcol + 55;
                startcol3 = 410;


                linePos = 250;
                startcol2 = startcol + 155
                doc.text('Date', startcol, linePos).text('Company', 100, linePos).text('VendorInvNo', 210, linePos).text('VendorInvDate', 290, linePos).text('Account', 390, linePos).text('Status', 520, linePos);
                linePos += 20;
                doc.text(PODATE, startcol, linePos).text(vend.CompanyName, 100, linePos, {width: 110, align: 'left' }).text(req.body.VendorInvNum, 210, linePos).text(VDATE, 290, linePos).text(req.body.acctDesc, 390, linePos, {width: 130, align: 'left' }).text(req.body.Status, 520, linePos);

                linePos += 25;
                startcol = 45;
                doc.text('Comments', startcol, linePos).text(req.body.Comments, 105, linePos, {width: 410, align: 'left' });

                var twos = req.body.details;//[1]
                var linePos = 390;
                doc.font('Palatino').fontSize(10).text('Qty', 45, linePos)
                    //.text('Account', 70, linePos)
                    .text('Desc', 145, linePos)
                    .text('Ref', 460, linePos)
                    .text('UnitPrice', 500, linePos)
                    .text('Total', 540, linePos, {width: 40, align: 'right' });

                linePos += 20

                twos.forEach(function (two) {
                    doc.font('Palatino').fontSize(10).text(po.Quantity, 45, linePos)
                        //.text(po.AccountName, 70, linePos, {width: 90, align: 'left' })
                        .text(two.Desc, 145, linePos, {width: 285, align: 'left' })
                        //.text(accounting.formatMoney(po.LineItemTax), 480, linePos, {width: 50, align: 'right' })
                        .text(accounting.formatMoney(two.UnitPrice), 430, linePos, {width: 50, align: 'right' })

                        .text(accounting.formatMoney(two.LineItemTot), 530, linePos, {width: 50, align: 'right' });
                    linePos = doc.y + 20;
                });
                linePos = doc.y + 100;// 100
                doc.rect(430, linePos - 20, 170, 125)
                    .stroke();

                var totCol = 440;
                var tolCol2 = 500;
                doc.font('Palatino').fontSize(10).text(potext, startcol, 200, {width: 410, align: 'right' });

                doc.text('Subtotal', totCol, linePos).text(accounting.formatMoney(req.body.SubTotal), tolCol2, linePos, {width: 80, align: 'right' });
//                linePos += 20;
//                doc.text('Tax%', totCol, linePos).text(req.body.TaxPcnt, tolCol2, linePos, {width: 80, align: 'right' });
//                linePos += 20;
//                doc.text('TaxAmt', totCol, linePos).text(accounting.formatMoney(req.body.TaxAmount), tolCol2, linePos, {width: 80, align: 'right' });
//                linePos += 20;
//                doc.text('Freight', totCol, linePos).text(accounting.formatMoney(req.body.Freight), tolCol2, linePos, {width: 80, align: 'right' });
//                linePos += 20;
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

                doc.write('./api/uploads/two/two' + TWOID + '.pdf');
                res.redirect('/two');
            });// the promise
    }

};
