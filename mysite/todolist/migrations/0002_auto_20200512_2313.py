# Generated by Django 3.0.4 on 2020-05-12 17:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='todoview',
            old_name='nameofuser',
            new_name='name',
        ),
    ]
