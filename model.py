import os
from sqlalchemy import *
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

class Model(object):
    def __init__(self):
        self.engine = create_engine("sqlite:///Resources/belly_button_biodiversity.sqlite", echo=False)
        self.metadata = MetaData()
        self.metadata.reflect(self.engine, only=['otu', 'samples', 'samples_metadata'])
        self.Base = automap_base(metadata=self.metadata)
        self.Base.prepare()
        self.otu, self.samples, self.samples_metadata = self.Base.classes.otu, self.Base.classes.samples, self.Base.classes.samples_metadata
        self.session = Session(self.engine)

    def get_otu_list(self):
        result = self.session.query(self.otu.lowest_taxonomic_unit_found)
        return [ otu[0] for otu in result ]