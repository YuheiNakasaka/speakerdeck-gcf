const cheerio = require("cheerio");
const request = require("request");
const cors = require('cors')({origin: true});

// Example:
// functions call getSpeakerdeckThumb --data='{"url":"https://speakerdeck.com/qrush/how-to-find-gifs"}'
exports.getSpeakerdeckThumb = (req, res) => {
  const url = req.body.url;

  if (url === undefined || url.length === 0) {
    res.send(JSON.stringify({status: 'fail'}));
  }

  // CORSを許可する
  cors(req, res, () => {
    request(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        res.send(JSON.stringify({status: 'fail'}));
      }
      const $ = cheerio.load(body);
      const imgUrl = $('meta[property="og:image"]').attr('content');
      const uid = imgUrl.match(/https:\/\/speakerd\.s3\.amazonaws\.com\/presentations\/(.+?)\//)[1];
      const orgThumb = "https://speakerd.s3.amazonaws.com/presentations/" + uid + "/slide_0.jpg";
      const miniThumb = "https://speakerd.s3.amazonaws.com/presentations/" + uid + "/slide_0.jpg";
      const resp = {
        orgThumb: orgThumb,
        miniThumb: miniThumb,
        status: 'ok',
      }
      res.send(JSON.stringify(resp));
    });
  });
};
