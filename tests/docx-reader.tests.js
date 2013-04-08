var assert = require("assert");

var docxReader = require("../lib/docx-reader");
var documents = require("../lib/documents");
var XmlElement = require("../lib/xmlreader").Element;

var testing = require("./testing");
var test = testing.test;
var testData = testing.testData;
var createFakeDocxFile = testing.createFakeDocxFile;


describe("docx-reader", function() {
    test("can read document with single paragraph with single run of text", function() {
        var expectedDocument = documents.Document([
            documents.Paragraph([
                documents.Run([
                    documents.Text("Hello.")
                ])
            ])
        ]);
        var docxFile = createFakeDocxFile({
            "word/document.xml": testData("simple/word/document.xml")
        });
        return docxReader.read(docxFile).then(function(result) {
            assert.deepEqual(expectedDocument, result.document);
        });
    });
    
    test("can read paragraph styles", function() {
        var docxFile = createFakeDocxFile({
            "word/document.xml": testData("paragraphStyles/word/document.xml")
        });
        return docxReader.read(docxFile).then(function(result) {
            var paragraph = result.document.children[0];
            assert.deepEqual("Heading1", paragraph.properties.styleName);
        });
    });
    
    test("hyperlink hrefs are read from relationships file", function() {
        var docxFile = createFakeDocxFile({
            "word/document.xml": testData("hyperlinks/word/document.xml"),
            "word/_rels/document.xml.rels": testData("hyperlinks/word/_rels/document.xml.rels")
        });
        return docxReader.read(docxFile).then(function(result) {
            var paragraph = result.document.children[0];
            assert.equal(1, paragraph.children.length);
            var hyperlink = paragraph.children[0];
            assert.equal(hyperlink.href, "http://www.example.com");
            assert.equal(hyperlink.children.length, 1);
        });
    });
});
