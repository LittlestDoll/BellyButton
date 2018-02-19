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

    def get_names(self):
        result = self.session.query(self.samples_metadata.SAMPLEID) 
        return [ "BB_"+str(id[0]) for id in result ]  

    def get_otu_list(self):
        result = self.session.query(self.otu.otu_id, self.otu.lowest_taxonomic_unit_found)
        return { otu[0]:otu[1] for otu in result }

    def get_sample(self, sampleid):
        result = self.session.query(self.samples_metadata).filter(self.samples_metadata.SAMPLEID == int(sampleid))
        row = result[0].__dict__
        row.pop('_sa_instance_state', None)
        return row

    def get_freq(self, sampleid):
        result = self.session.query(self.samples_metadata.WFREQ).filter(self.samples_metadata.SAMPLEID == int(sampleid))
        return result[0]

    def get_otuID_and_values(self, sample):
        response = {'otu_ids':[], 'sample_values': []}
        results = self.engine.execute('SELECT otu_id, %s FROM samples ORDER BY %s DESC' % (sample, sample))
        for result in results:
            response['otu_ids'].append(result[0])
            response['sample_values'].append(result[1])
        return response    

            
