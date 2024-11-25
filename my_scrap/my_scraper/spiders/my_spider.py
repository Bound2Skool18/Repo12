import scrapy
from scrapy.selector import Selector
from ..items import BookItem  # Correct import path for BookItem

class BookSpider(scrapy.Spider):
    name = "book_spider"  # Unique name for your spider
    allowed_domains = ["amazon.com"]
    start_urls = ["https://www.amazon.com/s?k=books&ref=nb_sb_noss"]  # Ensure correct URL structure

    def parse(self, response):
        selector = Selector(response)
        # Adjust selectors to match book listings on Amazon
        products = selector.xpath("//div[contains(@class, 's-search-results')]//div[@data-component-type='s-search-result']")

        for product in products:
            item = BookItem()
            # Extract title (assuming it's within an element with 'a-size-medium a-color-base a-text-normal' class)
            item['title'] = product.xpath(".//span[@class='a-size-medium a-color-base a-text-normal']/text()").get()
            # Extract price (assuming it's within a span with 'a-price-whole' class)
            item['price'] = product.xpath(".//span[@class='a-price-whole']/text()").get()
            yield item

        # Follow next page links
        next_page = selector.xpath("//ul[@class='a-pagination']//li[@class='a-last']/a/@href").get()
        if next_page is not None:
            next_page_url = response.urljoin(next_page)  # Ensure the URL is absolute
            yield scrapy.Request(next_page_url, callback=self.parse)
