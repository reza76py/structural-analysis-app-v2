from django.urls import path
from .views import NodeListCreateView, NodeDetailView, NodesRestartView

urlpatterns = [
    path('nodes/', NodeListCreateView.as_view(), name='nodes-list-create'),
    path('nodes/<int:pk>/', NodeDetailView.as_view(), name='node-detail'),
    path('nodes/reset/', NodesRestartView.as_view(), name='nodes-reset'),
]
