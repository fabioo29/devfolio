from django.db import models

class Git_Project(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=40)
    desc = models.TextField(blank=False, null=False)
    topics = models.JSONField(blank=False, null=False)
    url = models.TextField(blank=False, null=False)
    featured = models.BooleanField("Featured project?",default=0, choices=[(True,'True'), (False,'False')])
    image = models.ImageField()

    class Meta:
        verbose_name_plural = "Github_Archive"

    def __str__(self):
        return self.title
