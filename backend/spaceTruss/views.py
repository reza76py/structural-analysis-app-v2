from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Node
from .serializers import NodeSerializer
from django.db import transaction


class NodeListCreateView(APIView):
    def get(self, request):
        nodes = Node.objects.all()
        serializer = NodeSerializer(nodes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NodeDetailView(APIView):
    def delete(self, request, pk):
        node = get_object_or_404(Node, pk=pk)
        node.delete()
        return Response({"message": "Node deleted"}, status=status.HTTP_204_NO_CONTENT)
    

class NodesRestartView(APIView):
    def delete(self, request):
        try:
            with transaction.atomic():  # Ensures integrity
                count, _ = Node.objects.all().delete()
                if count == 0:
                    return Response({"message": "No nodes found to delete."}, status=status.HTTP_200_OK)
                return Response({"message": f"{count} nodes deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)