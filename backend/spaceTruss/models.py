from django.db import models

class Node(models.Model):
    name = models.CharField(max_length=10)
    x = models.DecimalField(max_digits=10, decimal_places=2)
    y = models.DecimalField(max_digits=10, decimal_places=2)
    z = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
