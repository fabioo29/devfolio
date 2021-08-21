from django.contrib import admin

from main.models import Git_Project

class Git_Project__Admin(admin.ModelAdmin):
    list_display = ('id', 'title', 'featured')
    list_filter = ('featured',)

admin.site.register(Git_Project, Git_Project__Admin)
