# Generated by Django 5.0.6 on 2024-07-24 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='likes',
            field=models.PositiveIntegerField(default=0),
        ),
    ]