# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.item import Item, Field

class BookItem(Item):  # Correct class name to BookItem
    title = Field()  # Define field for title
    price = Field()  # Define field for price

