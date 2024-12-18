const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
 
const getUrlAnalytics = async (req, res) => {
  const { alias } = req.params;

  try {
    const analytics = await Analytics.findOne({ alias });
    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found' });
    }

    res.json({
      totalClicks: analytics.totalClicks,
      uniqueClicks: analytics.uniqueClicks,
      clicksByDate: analytics.clicksByDate.slice(-7),  //last 7 days
      osType: analytics.osType,
      deviceType: analytics.deviceType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
 
const getTopicAnalytics = async (req, res) => {
  const { topic } = req.params;

  try {
    const urls = await Url.find({ topic }); 
    const analyticsData = [];

    for (let url of urls) {
      const analytics = await Analytics.findOne({ alias: url.alias });
      if (analytics) {
        analyticsData.push({
          shortUrl: url.shortUrl,
          totalClicks: analytics.totalClicks,
          uniqueClicks: analytics.uniqueClicks,
        });
      }
    }

    const totalClicks = analyticsData.reduce((acc, item) => acc + item.totalClicks, 0);
    const uniqueClicks = analyticsData.reduce((acc, item) => acc + item.uniqueClicks, 0);

    res.json({
      totalClicks,
      uniqueClicks,
      clicksByDate: analyticsData.reduce((acc, item) => {
        item.clicksByDate.forEach(cd => {
          const existing = acc.find(e => e.date === cd.date);
          if (existing) existing.clickCount += cd.clickCount;
          else acc.push(cd);
        });
        return acc;
      }, []),
      urls: analyticsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getOverallAnalytics = async (req, res) => {
  const userId = req.user.id;  

  try {
    const urls = await Url.find({ user: userId });
    const analyticsData = [];

    for (let url of urls) {
      const analytics = await Analytics.findOne({ alias: url.alias });
      if (analytics) {
        analyticsData.push(analytics);
      }
    }

    const totalUrls = analyticsData.length;
    const totalClicks = analyticsData.reduce((acc, item) => acc + item.totalClicks, 0);
    const uniqueClicks = analyticsData.reduce((acc, item) => acc + item.uniqueClicks, 0);

    res.json({
      totalUrls,
      totalClicks,
      uniqueClicks,
      clicksByDate: analyticsData.reduce((acc, item) => {
        item.clicksByDate.forEach(cd => {
          const existing = acc.find(e => e.date === cd.date);
          if (existing) existing.clickCount += cd.clickCount;
          else acc.push(cd);
        });
        return acc;
      }, []),
      osType: analyticsData.reduce((acc, item) => {
        item.osType.forEach(os => {
          const existing = acc.find(e => e.osName === os.osName);
          if (existing) existing.uniqueClicks += os.uniqueClicks;
          else acc.push(os);
        });
        return acc;
      }, []),
      deviceType: analyticsData.reduce((acc, item) => {
        item.deviceType.forEach(device => {
          const existing = acc.find(e => e.deviceName === device.deviceName);
          if (existing) existing.uniqueClicks += device.uniqueClicks;
          else acc.push(device);
        });
        return acc;
      }, []),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getUrlAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
};
